import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@saileshbrotickets/common'
import { Message } from 'node-nats-streaming'
import Order from '../../models/Order'
import queueGroupName from './queue_group_name'

export default class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  queueGroupName: string = queueGroupName
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
  async onMessage(
    data: PaymentCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const order = await Order.findById(data.orderId)
    if (!order) {
      throw new Error('Order not found')
    }
    order.set({
      status: OrderStatus.Complete,
    })
    await order.save()

    msg.ack()
  }
}
