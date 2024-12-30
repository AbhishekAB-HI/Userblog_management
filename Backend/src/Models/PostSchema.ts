import mongoose, { Schema } from "mongoose";
import { IPost } from "../Entities/Userentities";

const postSchema :Schema = new Schema({

    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
    
})

 const postSchemaDetail = mongoose.model<IPost>("Post", postSchema);

 export default postSchemaDetail;








