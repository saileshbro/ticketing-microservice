import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { NotAuthorizedError } from '../errors'

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError()
  }
  next()
}
export default requireAuth
