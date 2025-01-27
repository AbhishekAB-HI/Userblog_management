
import mongoose, { Schema }  from "mongoose";
import { IUser } from "../Entities/Userentities";

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  
});


const userBlogSchema = mongoose.model<IUser>("User", userSchema);

export default userBlogSchema;