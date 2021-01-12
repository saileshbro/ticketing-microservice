import { NotFoundError } from '@saileshbrotickets/common'
import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import Ticket from '../models/Ticket'

const showTicketRouter = Router()
showTicketRouter.get(
  '/api/tickets/:id',
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
      throw new NotFoundError()
    }
    return res.json(ticket)
  },
)

export default showTicketRouter
