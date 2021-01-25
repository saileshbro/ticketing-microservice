import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequests,
} from '@saileshbrotickets/common'
import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import Order from '../models/Order'
import stripe from '../stripe'

const createChargeRouter = Router()
createChargeRouter.post(
  '/api/payments',
  requireAuth,
  body('token').not().isEmpty(),
  body('orderId').isMongoId().not().isEmpty(),
  validateRequests,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body
    const order = await Order.findById(orderId)
    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order.')
    }
    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    })
    return res.status(201).send({ success: true })
  },
)
export default createChargeRouter
