import request from 'supertest'
import app from '../../app'
import Ticket from '../../models/Ticket'
import { OrderStatus } from '@saileshbrotickets/common'
it('marks an order as cancelled', async () => {
  const ticket = Ticket.build({
    title: 'jdkfas',
    price: 289,
  })
  await ticket.save()
  const userCookie = global.signin()
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userCookie)
    .send({ ticketId: ticket.id })
    .expect(201)
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(204)
  const { body: updatedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(200)
  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)
})

it.todo('publishes an event when the order is cancelled')
