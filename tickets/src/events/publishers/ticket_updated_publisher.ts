import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@saileshbrotickets/common'

export default class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
