import request from 'supertest'
import app from '../../app'
import Ticket from '../../models/Ticket'
import { natsWrapper } from '../../nats_wrapper'

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({})
  expect(response.status).not.toEqual(404)
})
it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401)
})
it('returns status other than 401 if user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})
  expect(response.status).not.toEqual(401)
})
it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: '', price: 10 })
    .expect(400)
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ price: 10 })
    .expect(400)
})
it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'fasdfas', price: 'fads;lfasd' })
    .expect(400)
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'fasdfas', price: -100 })
    .expect(400)
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'fasdfas' })
    .expect(400)
})
it('created a ticket with valid inputs', async () => {
  const title = 'dfadkljfaskd'
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 29,
    })
    .expect(201)
  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].title).toEqual(title)
  expect(tickets[0].price).toEqual(29)
})
it('publishes an event', async () => {
  const title = 'dfadkljfaskd'
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 29,
    })
    .expect(201)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
