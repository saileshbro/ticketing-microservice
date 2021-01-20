import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from '@saileshbrotickets/common'
import { Message } from 'node-nats-streaming'
import Ticket from '../../models/Ticket'
import queueGroupName from './queue_group_name'

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  queueGroupName: string = queueGroupName
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
  async onMessage(
    data: TicketCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const { id, title, price } = data
    const ticket = Ticket.build({
      id,
      title,
      price,
    })

    await ticket.save()
    msg.ack()
  }
}
