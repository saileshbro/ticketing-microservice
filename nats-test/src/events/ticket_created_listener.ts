import { Message } from 'node-nats-streaming'
import Listener from '../../../common/src/events/base_listener'
import { Subjects } from '../../../common/src/events/subjects'
import TicketCreatedEvent from '../../../common/src/events/ticket_created_event'

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  queueGroupName: string = 'payments-services'
  readonly subject = Subjects.TicketCreated
  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event Data!', data)
    msg.ack()
  }
}
