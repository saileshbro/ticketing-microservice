import { MongoMemoryServer } from 'mongodb-memory-server'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[]
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

global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  }
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const sessionJSON = JSON.stringify({ jwt: token })
  const base64 = Buffer.from(sessionJSON).toString('base64')
  return [`express:sess=${base64}`]
}
