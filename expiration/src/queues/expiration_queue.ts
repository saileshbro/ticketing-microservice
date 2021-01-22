import Queue from 'bull'
import ExiprationCompletePublisher from '../events/publishers/expiration_complete_publisher'
import { natsWrapper } from '../nats_wrapper'
interface Payload {
  orderId: string
}
const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
})
expirationQueue.process(async job => {
  new ExiprationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  })
})

export default expirationQueue
