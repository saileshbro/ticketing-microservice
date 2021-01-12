import { NotFoundError } from '@saileshbrotickets/common'
import { Router, Request, Response } from 'express'
import Ticket from '../models/Ticket'

const indexTicketRouter = Router()
indexTicketRouter.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({})
  return res.send(tickets)
})

export default indexTicketRouter
