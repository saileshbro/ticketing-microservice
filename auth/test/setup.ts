import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../src/app'
declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>
    }
  }
}
let mongo: MongoMemoryServer
beforeAll(async () => {
  process.env.JWT_KEY = 'DSFKLDSAFKLDSAJFDKAS'
  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (const coll of collections) {
    await coll.deleteMany({})
  }
})
afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})
global.signin = async () => {
  const email = 'test@test.com'
  const password = 'password'
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201)
  return response.get('Set-Cookie')
}
