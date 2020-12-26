import {Router} from 'express';
const signUpRoute = Router()
signUpRoute.get("/api/users/signup",(req,res)=>{
  return res.send("Hi there!")
})
export default signUpRoute
