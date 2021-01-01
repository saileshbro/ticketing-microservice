import { Router, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { BadRequestError } from '../errors'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import validateRequest from './../middlewares/validate_requests'
const signUpRoute = Router()
signUpRoute.post(
  '/api/users/signup',
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new BadRequestError('Email in use.')
    }
    const user = User.build({
      email,
      password,
    })
    await user.save()
    // generate jwt
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
    return res.status(201).send(user)
  },
)
export default signUpRoute
