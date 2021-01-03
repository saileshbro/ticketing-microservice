import { Request, Response, Router } from 'express'
const signOutRoute = Router()
signOutRoute.post('/api/users/signout', (req: Request, res: Response) => {
  req.session = null
  return res.send({})
})
export default signOutRoute
