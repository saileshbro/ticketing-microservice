import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from '@saileshbrotickets/common'
import { Message } from 'node-nats-streaming'
import Order from '../../models/Order'
import OrderCancelledPublisher from '../publishers/order_cancelled_publisher'
import queueGroupName from './queue_group_name'

export default class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName: string = queueGroupName
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
  async onMessage(
    data: ExpirationCompleteEvent['data'],
    msg: Message,
  ): Promise<void> {
    const order = await Order.findById(data.orderId).populate('ticket')
    if (!order) {
      throw new Error('Order not found!')
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack()
    }
    order.set({ status: OrderStatus.Cancelled })
    await order.save()
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    })
    msg.ack()
  }
}
