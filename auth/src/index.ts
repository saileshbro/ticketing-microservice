import express from "express"
import {json} from "body-parser"
import currentUserRouter from "./routes/current_user";
import signInRoute from "./routes/siginin";
import signUpRoute from './routes/signup';
import signOutRoute from './routes/signout';


const app = express();
app.use(json())
app.use(currentUserRouter)
app.use(signInRoute)
app.use(signUpRoute)
app.use(signOutRoute)
app.listen(3000,()=>{
  console.log("Listening on port 3000")
})
