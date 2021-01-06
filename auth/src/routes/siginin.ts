import { BadRequestError, validateRequests } from '@saileshbrotickets/common'
import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import PasswordManager from '../services/password_manager'

const signInRoute = Router()
signInRoute.post(
  '/api/users/signin',
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password'),
  validateRequests,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      throw new BadRequestError('Invalid credentials')
    }
    const passwordsMatch = await PasswordManager.compare(
      user.password,
      password,
    )
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials')
    }
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!,
    )
    req.session = {
      jwt: userJwt,
    }
    // store it on session object
    return res.status(200).send(user)
  },
)
export default signInRoute
