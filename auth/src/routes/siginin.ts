import {Router} from 'express';
const signInRoute = Router()
signInRoute.get("/api/users/signin",(req,res)=>{
  return res.send("Hi there!")
})
export default signInRoute
