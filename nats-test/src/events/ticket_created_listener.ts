import { Message } from 'node-nats-streaming'
import Listener from './base_listener'
import { Subjects } from './subjects'
import { TicketCreatedEvent } from './ticket_created_event'

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  queueGroupName: string = 'payments-services'
  readonly subject = Subjects.TicketCreated
  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event Data!', data)
    msg.ack()
  }
}
