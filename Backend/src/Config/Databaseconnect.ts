
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const mongourl: string = "mongodb+srv://4270abhishek:LUbAMBxA0San36uw@cluster0.oylin.mongodb.net/userblogmanagement";

 const connectDatabase =()=>{
      try {
        mongoose.set("debug", true);
        mongoose.connect(mongourl);
      } catch (error) {
        console.log("Error during dbconnect:",error)
      }
 }

 export default connectDatabase