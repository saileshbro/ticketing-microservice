import { TicketCreatedEvent } from '@saileshbrotickets/common'
import { natsWrapper } from '../../../nats_wrapper'
import TicketCreatedListener from '../ticket_created_listener'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'
import Ticket from '../../../models/Ticket'
const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client)
  // Create an instance of the listener
  const data: TicketCreatedEvent['data'] = {
    id: new Types.ObjectId().toHexString(),
    price: 200,
    title: 'Title',
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  }
  // create a fake data event
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  }
  // create a fake Message
  return { listener, data, message }
}
it('creates and saves a ticket', async () => {
  const { listener, data, message } = await setup()
  // call the onMessage function with the data object and
  // message object
  await listener.onMessage(data, message)
  // assert make sure ticket was created
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
  expect(ticket!.id).toEqual(data.id)
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})
it('acks the message', async () => {
  const { listener, data, message } = await setup()
  // call the onMessage function with the data object and
  // message object
  await listener.onMessage(data, message)
  // assert make sure ticket was created
  expect(message.ack).toHaveBeenCalled()
})
