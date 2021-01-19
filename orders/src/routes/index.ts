import { requireAuth } from '@saileshbrotickets/common'
import { Router, Request, Response } from 'express'
import Order from '../models/Order'
const indexOrderRouter = Router()
indexOrderRouter.get(
  '/api/orders',
  requireAuth,
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.currentUser!.id,
    }).populate('ticket')
    return res.send(orders)
  },
)
export default indexOrderRouter
