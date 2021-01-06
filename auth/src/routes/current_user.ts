import { currentUser } from '@saileshbrotickets/common'
import { Request, Response, Router } from 'express'
const currentUserRouter = Router()
currentUserRouter.get(
  '/api/users/currentuser',
  currentUser,
  async (req: Request, res: Response) => {
    return res.json({ currentUser: req.currentUser ?? null })
  },
)
export default currentUserRouter
