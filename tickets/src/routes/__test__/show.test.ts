import { Types } from 'mongoose'
import request from 'supertest'
import app from '../../app'

it('returns 404 if ticket is not found', async () => {
  const id = new Types.ObjectId().toHexString()
  await request(app).get(`/api/tickets/${id}`).send().expect(404)
})
it('returns ticket if ticket is  found', async () => {
  const title = 'dfj;lkjasfsdfaiejfioajsd'
  const price = 572349
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201)
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)
  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})
