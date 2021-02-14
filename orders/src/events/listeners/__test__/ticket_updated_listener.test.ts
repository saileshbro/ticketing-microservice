import { TicketUpdatedEvent } from '@saileshbrotickets/common'
import { natsWrapper } from '../../../nats_wrapper'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'
import Ticket from '../../../models/Ticket'
import TicketUpdatedListener from '../ticket_updated_listener'
const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)
  const ticket = await Ticket.build({
    price: 200,
    title: 'Title',
    id: new Types.ObjectId().toHexString(),
  })
  await ticket.save()
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    price: 200000,
    userId: new Types.ObjectId().toHexString(),
    title: 'New title',
  }
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  }
  return { listener, data, message, ticket }
}
it('finds,updates, and saves a ticket', async () => {
  const { listener, data, message, ticket } = await setup()
  await listener.onMessage(data, message)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})
it('acks the message', async () => {
  const { listener, data, message } = await setup()
  await listener.onMessage(data, message)
  expect(message.ack).toHaveBeenCalled()
})
test('does not call ack if the test has a skipped version number', async () => {
  const { listener, data, message, ticket } = await setup()
  data.version = 10
  try {
    await listener.onMessage(data, message)
  } catch (error) {}
  expect(message.ack).not.toHaveBeenCalled()
})
