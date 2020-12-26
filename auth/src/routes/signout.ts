import {Router} from 'express';
const signOutRoute = Router()
signOutRoute.get("/api/users/signout",(req,res)=>{
  return res.send("Hi there!")
})
export default signOutRoute
