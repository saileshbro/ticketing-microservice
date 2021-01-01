import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import currentUserRouter from './routes/current_user'
import signInRoute from './routes/siginin'
import signUpRoute from './routes/signup'
import signOutRoute from './routes/signout'
import errorHandler from './middlewares/error_handler'
import NotFoundError from './errors/not_found_error'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: true,
  }),
)
app.use(currentUserRouter)
app.use(signInRoute)
app.use(signUpRoute)
app.use(signOutRoute)
app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error(error)
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })
}
start()
