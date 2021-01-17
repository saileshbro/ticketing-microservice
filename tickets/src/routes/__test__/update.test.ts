import { Types } from 'mongoose'

import request from 'supertest'
import app from '../../app'
import { natsWrapper } from '../../nats_wrapper'

it('returns 404 if id not exists', async () => {
  const id = new Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'sdakfaksdjf',
      price: 20,
    })
    .expect(404)
})
it('returns 401 if user not authenticated', async () => {
  const id = new Types.ObjectId().toHexString()
  await request(app).put(`/api/tickets/${id}`).expect(401)
})
it('returns 401 if user doesnot own ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sdakfaksdjf',
      price: 20,
    })
    .expect(201)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'jasdkjfakdsjf',
      price: 200,
    })
    .expect(401)
})
it('returns 400 if user provides invalid title or price', async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'sdakfaksdjf',
      price: 20,
    })
    .expect(201)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      ticket: '',
      price: 200,
    })
    .expect(400)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      ticket: 'dlsfklsadhfkasd',
      price: -200,
    })
    .expect(400)
})
it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'sdakfaksdjf',
      price: 20,
    })
    .expect(201)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200)
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
  expect(ticketResponse.body.title).toEqual('new title')
  expect(ticketResponse.body.price).toEqual(100)
})
it('publishes an event', async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'sdakfaksdjf',
      price: 20,
    })
    .expect(201)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
