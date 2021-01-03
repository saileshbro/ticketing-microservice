import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import app from '../src/app'
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
