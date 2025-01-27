import { ObjectId } from "mongoose";



export  interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  profileImage: string;
  isActive: boolean;
 
}


export interface IReview {
  ReviewedBy: string; 
  Rating: number;
  comment: string;
  _id: ObjectId; 
}


export interface IPost extends Document {
  title: string;
  description: string;
  image: string;
  Review: ReviewDetail[];
  date:Date
}

export interface ReviewDetail extends Document {
  ReviewedBy: string;
  Rating: Number;
  comment: string;
}



