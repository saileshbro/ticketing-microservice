import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@saileshbrotickets/common'
import { Message } from 'node-nats-streaming'
import expirationQueue from '../../queues/expiration_queue'
import queueGroupName from './queue_group_name'

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  queueGroupName: string = queueGroupName
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated
  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      },
    )
    msg.ack()
  }
}
