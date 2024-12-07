import express from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import {connectDB} from "./lib/db.js"
const app = express();

app.use(express.json());
app.use(cookieParser())
dotenv.config();

app.use("/api/auth" , authRoutes)
app.use("/api/message" , messageRoutes)

app.listen(process.env.PORT , () =>{
    console.log("app is listening on the port");
    connectDB();
})