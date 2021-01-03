import { Request, Response, Router } from 'express'
import currentUser from '../middlewares/current_user'
import requireAuth from '../middlewares/require_auth'
const currentUserRouter = Router()
currentUserRouter.get(
  '/api/users/currentuser',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    return res.json({ currentUser: req.currentUser ?? null })
  },
)
export default currentUserRouter
