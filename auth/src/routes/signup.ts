import { Router, Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import { RequestValidationError, DatabaseConnectionError } from '../errors'
const signUpRoute = Router()
signUpRoute.post(
  '/api/users/signup',
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }
    const { email, password } = req.body
    console.log('Creating a user.....')
    throw new DatabaseConnectionError()
    return res.json({})
  },
)
export default signUpRoute
