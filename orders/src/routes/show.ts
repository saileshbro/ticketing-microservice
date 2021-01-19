import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequests,
} from '@saileshbrotickets/common'
import { Router, Request, Response } from 'express'
import { param } from 'express-validator'
import { Types } from 'mongoose'
import Order from '../models/Order'
const showOrderRouter = Router()
showOrderRouter.get(
  '/api/orders/:orderId',
  requireAuth,
  param('orderId')
    .not()
    .isEmpty()
    .custom((input: string) => Types.ObjectId.isValid(input))
    .withMessage('Order id must be valid'),
  validateRequests,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket')
    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    return res.send(order)
  },
)
export default showOrderRouter
