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
import PaymentCreatedPublisher from '../events/publishers/payment_created_publisher'
import Order from '../models/Order'
import Payment from '../models/Payment'
import { natsWrapper } from '../nats_wrapper'
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
    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    })
    const payment = Payment.build({
      orderId: order.id,
      stripeId: charge.id,
    })
    await payment.save()
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: order.id,
      stripeId: charge.id,
    })
    return res.status(201).send({ id: payment.id })
  },
)
export default createChargeRouter
