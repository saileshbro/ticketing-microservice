import { OrderCreatedEvent, OrderStatus } from '@saileshbrotickets/common'
import { Types } from 'mongoose'
import Order from '../../../models/Order'
import { natsWrapper } from '../../../nats_wrapper'
import OrderCreatedListener from '../order_created_listener'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const data: OrderCreatedEvent['data'] = {
    id: Types.ObjectId().toHexString(),
    expiresAt: 'sjkl',
    status: OrderStatus.Created,
    ticket: {
      id: 'sdklfas',
      price: 10,
    },
    userId: 'fjklsd',
    version: 0,
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { listener, data, msg }
}
it('replicates the order info', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const order = await Order.findById(data.id)
  expect(order!.price).toEqual(data.ticket.price)
})
it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
