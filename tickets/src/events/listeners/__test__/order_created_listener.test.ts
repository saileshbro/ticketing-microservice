import {
  OrderCreatedEvent,
  OrderStatus,
  TicketUpdatedEvent,
} from '@saileshbrotickets/common'
import { Types } from 'mongoose'
import Ticket from '../../../models/Ticket'
import { natsWrapper } from '../../../nats_wrapper'
import OrderCreatedListener from '../order_created_listener'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const ticket = Ticket.build({
    title: 'Concert',
    price: 99,
    userId: new Types.ObjectId().toHexString(),
  })
  await ticket.save()
  const data: OrderCreatedEvent['data'] = {
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    id: new Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new Types.ObjectId().toHexString(),
    expiresAt: new Date(Date.now()).toISOString(),
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { listener, ticket, data, msg }
}
it('sets the user id of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket.orderId).toEqual(data.id)
})
it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
it('publishes a ticket updated event', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const jsonStr = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  const updatedTicket = JSON.parse(jsonStr) as TicketUpdatedEvent['data']
  expect(data.id).toEqual(updatedTicket.orderId)
})
