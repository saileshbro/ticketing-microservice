import { Router, Request, Response } from 'express'
const indexOrderRouter = Router()
indexOrderRouter.get('/api/orders', async (req: Request, res: Response) => {
  return res.send({})
})
export default indexOrderRouter
