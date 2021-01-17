import { requireAuth, validateRequests } from '@saileshbrotickets/common'
import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import TicketCreatedPublisher from '../events/publishers/ticket_created_publisher'
import Ticket from '../models/Ticket'
import { natsWrapper } from '../nats_wrapper'

const createTicketRouter = Router()
createTicketRouter.post(
  '/api/tickets',
  requireAuth,
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  validateRequests,
  async (req: Request, res: Response) => {
    const { title, price } = req.body

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id })
    await ticket.save()
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: req.currentUser!.id,
    })
    return res.status(201).json(ticket)
  },
)
export default createTicketRouter
