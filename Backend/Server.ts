import express from 'express'
import dotenv from 'dotenv'
import  userRoute  from "./src/Routes/Userroute.ts";
import cors from "cors";
import connectDatabase from './src/Config/Databaseconnect.ts';
dotenv.config()

connectDatabase()

const app = express()  
app.use(express.json());
const port = process.env.PORT || 3000

app.use(
  cors({
    origin: "https://userblog-management-kyc7.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/user", userRoute);

app.listen(port,()=>{ 
    console.log(`Server running at port ${port}`)
}); 






