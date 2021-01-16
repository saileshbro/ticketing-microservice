import Publisher from './base_publisher'
import { Subjects } from './subjects'
import { TicketCreatedEvent } from './ticket_created_event'

export default class TicketCreatedPublsher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
}
