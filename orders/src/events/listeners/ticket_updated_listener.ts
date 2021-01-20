import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
} from '@saileshbrotickets/common'
import { Message } from 'node-nats-streaming'
import Ticket from '../../models/Ticket'
import queueGroupName from './queue_group_name'

export default class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  queueGroupName: string = queueGroupName
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated
  async onMessage(
    data: TicketUpdatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const { title, price } = data
    const ticket = await Ticket.findByEvent(data)
    if (!ticket) {
      throw new Error('Ticket not found!')
    }
    ticket.set({ title, price })
    await ticket.save()
    msg.ack()
  }
}
