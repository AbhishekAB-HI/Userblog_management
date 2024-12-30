import { ObjectId } from "mongoose";



export  interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  profileImage: string;
  isActive:boolean
}


export interface IPost extends Document {
  title: string;
  description: string;
  image:string
}



