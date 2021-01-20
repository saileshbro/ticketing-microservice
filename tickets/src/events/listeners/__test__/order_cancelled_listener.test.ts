import {
  OrderCancelledEvent,
  TicketUpdatedEvent,
} from '@saileshbrotickets/common'
import { Types } from 'mongoose'
import Ticket from '../../../models/Ticket'
import { natsWrapper } from '../../../nats_wrapper'
import { Message } from 'node-nats-streaming'
import OrderCancelledListener from '../order_cancelled_listener'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const orderId = new Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'Concert',
    price: 99,
    userId: 'fjdksljafas',
  })
  ticket.set({ orderId })
  await ticket.save()
  const data: OrderCancelledEvent['data'] = {
    ticket: {
      id: ticket.id,
    },
    id: new Types.ObjectId().toHexString(),
    version: 0,
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { listener, ticket, data, msg, orderId }
}
test('updates the ticket, publishes an event, and acks the message', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const jsonStr = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  const updatedTicketEventData = JSON.parse(
    jsonStr,
  ) as TicketUpdatedEvent['data']
  expect(updatedTicket.id).toEqual(updatedTicketEventData.id)
})
