import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@saileshbrotickets/common'
import { Message } from 'node-nats-streaming'
import Order from '../../models/Order'
import queueGroupName from './queue_group_name'
export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  queueGroupName: string = queueGroupName
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    })
    await order.save()
    msg.ack()
  }
}
