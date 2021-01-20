import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from '@saileshbrotickets/common'

export default class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated
}
