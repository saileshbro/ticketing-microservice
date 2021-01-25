import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from '@saileshbrotickets/common'

export default class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
