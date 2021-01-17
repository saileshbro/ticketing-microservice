import { Router, Request, Response } from 'express'
const showOrderRouter = Router()
showOrderRouter.get(
  '/api/orders/:orderId',
  async (req: Request, res: Response) => {
    return res.send({})
  },
)
export default showOrderRouter
