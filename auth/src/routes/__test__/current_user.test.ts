import request from 'supertest'
import app from '../../app'
it('responds with details about current user', async () => {
  const cookie = await global.signin()
  const user = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200)
  expect(user.body.currentUser.email).toEqual('test@test.com')
})
it('responds with null if not authenticated', async () => {
  const user = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)
  console.log(user.body)
  expect(user.body.currentUser).toBeNull()
})
