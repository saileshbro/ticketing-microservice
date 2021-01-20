import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequests,
} from '@saileshbrotickets/common'

import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import { Types } from 'mongoose'
import OrderCreatedPublisher from '../events/publishers/order_created_publisher'
import Order from '../models/Order'
import Ticket from '../models/Ticket'
import { natsWrapper } from '../nats_wrapper'

const createOrderRouter = Router()
const EXPIRATION_WINDOW_SECONDS = 15 * 60
createOrderRouter.post(
  '/api/orders',
  requireAuth,
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => Types.ObjectId.isValid(input))
    .withMessage('Ticket id must be valid'),
  validateRequests,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body
    // find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved!')
    }
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    })
    await order.save()
    // calculate an expiration date for this order
    // build the order and save the database
    // publish an event about order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
    })
    return res.status(201).send(order)
  },
)
export default createOrderRouter
