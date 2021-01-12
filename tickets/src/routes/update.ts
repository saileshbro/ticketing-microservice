import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequests,
} from '@saileshbrotickets/common'
import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import Ticket from '../models/Ticket'
const updateTicketRouter = Router()
updateTicketRouter.put(
  '/api/tickets/:id',
  requireAuth,
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  validateRequests,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
      throw new NotFoundError()
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    })
    await ticket.save()
    return res.send(ticket)
  },
)

export default updateTicketRouter
