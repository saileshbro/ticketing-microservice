import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'
import Order from '../../models/Order'
import Ticket from '../../models/Ticket'
import { OrderStatus } from '@saileshbrotickets/common'
it('fetches the order', async () => {
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
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(200)
  await request(app)
    .get(`/api/orders/fjskaljfs`)
    .set('Cookie', userCookie)
    .send()
    .expect(400)
  expect(fetchedOrder.id).toEqual(order.id)

  // create a ticket
  // make a request to build an order with this ticket
  // make request
})
it('returns an error if one user tries to fetch another users order', async () => {
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
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(200)
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401)
})
