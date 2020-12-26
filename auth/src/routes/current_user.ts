import {Router} from 'express';
const currentUserRouter = Router()
currentUserRouter.get("/api/users/currentuser",(req,res)=>{
  return res.send("Hi there!")
})
export default currentUserRouter;
