import request from 'supertest'
import app from '../../app'
import { Types } from 'mongoose'
import Order from '../../models/Order'
import Ticket from '../../models/Ticket'
import { OrderStatus } from '@saileshbrotickets/common'
import { natsWrapper } from '../../nats_wrapper'

it('returns an error if the ticket doesnot exists', async () => {
  const ticketId = new Types.ObjectId().toHexString()
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId,
    })
    .expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    price: 200,
    title: 'concett',
    id: new Types.ObjectId().toHexString(),
  })
  await ticket.save()
  const order = Order.build({
    ticket,
    userId: 'kl;dsjf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })
  await order.save()
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400)
})

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    price: 200,
    title: 'concett',
    id: new Types.ObjectId().toHexString(),
  })
  await ticket.save()
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201)
})
it('emits an order created event', async () => {
  const ticket = Ticket.build({
    price: 200,
    title: 'concett',
    id: new Types.ObjectId().toHexString(),
  })
  await ticket.save()
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
