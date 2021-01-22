import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@saileshbrotickets/common'

export default class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
