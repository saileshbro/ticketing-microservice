import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@saileshbrotickets/common'

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
}
