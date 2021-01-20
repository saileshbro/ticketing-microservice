import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequests,
} from '@saileshbrotickets/common'
import { Router, Request, Response } from 'express'
import { param } from 'express-validator'
import { Types } from 'mongoose'
import OrderCancelledPublisher from '../events/publishers/order_cancelled_publisher'
import Order from '../models/Order'
import { natsWrapper } from '../nats_wrapper'
const deleteOrderRouter = Router()
deleteOrderRouter.delete(
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
    order.status = OrderStatus.Cancelled
    await order.save()
    // publilsh an event saying this was cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })
    return res.status(204).send(order)
  },
)
export default deleteOrderRouter
