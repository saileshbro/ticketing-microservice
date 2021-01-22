import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@saileshbrotickets/common'

export default class ExiprationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
