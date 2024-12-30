import { ObjectId } from "mongoose";
import userBlogSchema from "../Models/Userblogschema.ts";
import { Tockens, userPayload } from "../Types/Usertoc.ts";
import HashPassword from "../Utils/Hashpassword.ts";
import { generateAccessToken, generateRefreshToken } from "../Utils/Jwt.ts";
import { IPost, IUser } from "../Entities/Userentities.ts";
import postSchemaDetail from "../Models/PostSchema.ts";

class UserRepository {
  async checkEmailExist(email: string): Promise<void> {
    try {
      const checkemail = await userBlogSchema.findOne({ email: email });
      if (checkemail) {
        throw new Error("Email is already exists");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async EditpostandSave(
    title: string,
    description: string,
    cloudinaryImageUrl: string,
    saveID: string
  ): Promise<void> {
    try {
      const findpost = await postSchemaDetail.findById(saveID);
      const savepost = await postSchemaDetail.findByIdAndUpdate(
        saveID,
        {
          title: title,
          description: description,
          image: cloudinaryImageUrl ? cloudinaryImageUrl : findpost?.image,
        },
        { new: true }
      );

      console.log("Post updated successfully:", savepost);
    } catch (error) {
      console.log("Error updating post:", error);
    }
  }

  async savePostinfo(
    title: string,
    description: string,
    cloudinaryImageUrl: string
  ): Promise<void> {
    try {
      const createNewPost = new postSchemaDetail({
        title: title,
        description: description,
        image: cloudinaryImageUrl,
      });

      const savePost = await createNewPost.save();
    } catch (error) {
      console.log(error);
    }
  }

  async findIdAndDelete(postId: string | undefined): Promise<void> {
    try {
      const getinfo = await postSchemaDetail.findByIdAndDelete(postId);
    } catch (error) {
      console.log(error);
    }
  }

  async findAllThePost(): Promise<IPost[] | undefined> {
    try {
      const AllPost = await postSchemaDetail.find();
      return AllPost;
    } catch (error) {
      console.log(error);
    }
  }

  async findtheEmail(
    email: string,
    password: string
  ): Promise<IUser | null | undefined> {
    try {
      const userinfo = await userBlogSchema.findOne({ email: email });

      return userinfo;
    } catch (error) {
      console.log(error);
    }
  }

  async verifyEmail(email: string): Promise<void> {
    try {
      const EmailVerify = await userBlogSchema.findOne({ email: email });

      if (!EmailVerify) {
        throw new Error("No user found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async savetheuser(name: string,email: string,password: string,image: string): Promise<void> {
    try {
      const saveThedata = new userBlogSchema({
        name: name,
        email: email,
        password: password,
        profileImage: image,
      });
      const savePassoword = await saveThedata.save();

      console.log(savePassoword, "password data");
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserRepository;
