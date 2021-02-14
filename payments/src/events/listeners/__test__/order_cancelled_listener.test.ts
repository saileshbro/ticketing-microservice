import { OrderCancelledEvent, OrderStatus } from '@saileshbrotickets/common'
import { Types } from 'mongoose'
import Order from '../../../models/Order'
import { natsWrapper } from '../../../nats_wrapper'
import OrderCancelledListener from '../order_cancelled_listener'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'dsajk',
    version: 0,
  })
  await order.save()
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    ticket: {
      id: 'sdklfas',
    },
    version: order.version + 1,
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { listener, order, data, msg }
}
it('updates the status of the order', async () => {
  const { listener, data, order, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})
it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
