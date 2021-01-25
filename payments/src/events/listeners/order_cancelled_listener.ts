import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@saileshbrotickets/common'
import { Message } from 'node-nats-streaming'
import Order from '../../models/Order'
import queueGroupName from './queue_group_name'

export default class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  queueGroupName: string = queueGroupName
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  async onMessage(
    data: OrderCancelledEvent['data'],
    msg: Message,
  ): Promise<void> {
    const order = await Order.findByEvent(data)
    if (!order) {
      throw new Error('Order not found!')
    }
    order.set({
      status: OrderStatus.Cancelled,
    })
    await order.save()
    msg.ack()
  }
}
