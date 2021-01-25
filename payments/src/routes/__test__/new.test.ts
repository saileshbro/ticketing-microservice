import { OrderStatus } from '@saileshbrotickets/common'
import { Types } from 'mongoose'
import request from 'supertest'
import app from '../../app'
import Order from '../../models/Order'
import stripe from '../../stripe'
it('returns 404 when purchased order which doesnot exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'djalkfas',
      orderId: Types.ObjectId().toHexString(),
    })
    .expect(404)
})
it('returns an 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId: Types.ObjectId().toHexString(),
    price: 200,
    status: OrderStatus.Created,
    version: 0,
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'djalkfas',
      orderId: order.id,
    })
    .expect(401)
})
it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = Types.ObjectId().toHexString()
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId,
    price: 200,
    status: OrderStatus.Cancelled,
    version: 0,
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'djalkfas',
      orderId: order.id,
    })
    .expect(400)
})
it('returns a 204 with valid inputs', async () => {
  const userId = Types.ObjectId().toHexString()
  const price = Math.floor(Math.random() * 100000)
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId,
    price,
    status: OrderStatus.Created,
    version: 0,
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)
  const stripeCharges = await stripe.charges.list({
    limit: 50,
  })
  const stripeCharge = stripeCharges.data.find(
    charge => charge.amount === price * 100,
  )
  expect(stripeCharge).toBeDefined()
  expect(stripeCharge!.currency).toEqual('usd')
  expect(stripeCharge!.amount).toEqual(price * 100)
})
