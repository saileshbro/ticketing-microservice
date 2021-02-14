import {
  ExpirationCompleteEvent,
  OrderCancelledEvent,
  OrderStatus,
} from '@saileshbrotickets/common'
import { Types } from 'mongoose'
import Order from '../../../models/Order'
import Ticket from '../../../models/Ticket'
import { natsWrapper } from '../../../nats_wrapper'
import ExpirationCompleteListener from '../expiration_complete_listener'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)
  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'fjakld',
    expiresAt: new Date(),
    ticket,
  })
  await order.save()
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { listener, ticket, order, data, msg }
}

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})
it('emit an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
  ) as OrderCancelledEvent['data']
  expect(eventData.id).toEqual(order.id)
})

it('ack the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
