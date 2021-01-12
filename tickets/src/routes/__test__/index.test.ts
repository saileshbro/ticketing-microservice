import request from 'supertest'
import app from '../../app'
const createTickets = () => {
  const title = 'dfj;lkjasfsdfaiejfioajsd'
  const price = 572349
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201)
}
it('can fetch a list of tickets', async () => {
  await createTickets()
  await createTickets()
  await createTickets()
  const response = await request(app).get('/api/tickets').send().expect(200)
  expect(response.body.length).toEqual(3)
})
