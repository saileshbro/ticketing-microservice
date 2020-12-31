import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import currentUserRouter from './routes/current_user'
import signInRoute from './routes/siginin'
import signUpRoute from './routes/signup'
import signOutRoute from './routes/signout'
import errorHandler from './middlewares/error_handler'
import NotFoundError from './errors/not_found_error'

const app = express()
app.use(json())
app.use(currentUserRouter)
app.use(signInRoute)
app.use(signUpRoute)
app.use(signOutRoute)
app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)
app.listen(3000, () => {
  console.log('Listening on port 3000')
})
