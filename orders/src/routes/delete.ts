import { Router, Request, Response } from 'express'
const deleteOrderRouter = Router()
deleteOrderRouter.delete(
  '/api/orders/:orderId',
  async (req: Request, res: Response) => {
    return res.send({})
  },
)
export default deleteOrderRouter
