import request from 'supertest'
import app from '../../app'
it('fails when a email that does not exists is supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400)
})
it('fails when incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'fdhjshdf',
    })
    .expect(400)
})
it('responds with cookie when correct password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
  const response = await request(app).post('/api/users/signin').send({
    email: 'test@test.com',
    password: 'password',
  })
  expect(response.get('Set-Cookie')).toBeDefined()
})
