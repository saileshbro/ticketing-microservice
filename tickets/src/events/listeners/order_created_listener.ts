import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@saileshbrotickets/common'
import { Message } from 'node-nats-streaming'
import Ticket from '../../models/Ticket'
import { natsWrapper } from '../../nats_wrapper'
import TicketUpdatedPublisher from '../publishers/ticket_updated_publisher'
import queueGroupName from './queue_group_name'

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  queueGroupName: string = queueGroupName
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated
  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    ticket.set('orderId', data.id)
    await ticket.save()
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    })
    msg.ack()
  }
}
