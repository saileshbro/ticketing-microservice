import Publisher from '../../../common/src/events/base_publisher'
import { Subjects } from '../../../common/src/events/subjects'
import TicketCreatedEvent from '../../../common/src/events/ticket_created_event'

export default class TicketCreatedPublsher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
}
