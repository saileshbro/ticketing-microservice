import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import currentUserRouter from './routes/current_user'
import signInRoute from './routes/siginin'
import signUpRoute from './routes/signup'
import signOutRoute from './routes/signout'
import { NotFoundError, errorHandler } from '@saileshbrotickets/common'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
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
export default app
