import { ObjectId } from "mongoose";
import cloudinary from "../Config/Cloudinary.ts";
import UserRepository from "../Repository/Userrepository.ts";
import { Tockens, userPayload } from "../Types/Usertoc.ts";
import HashPassword from "../Utils/Hashpassword.ts";
import { generateAccessToken, generateRefreshToken } from "../Utils/Jwt.ts";
import { IPost } from "../Entities/Userentities.ts";
import { Irepository } from "../interface/user/userRepository.ts";

class UserServices {
  constructor(private userRepository: Irepository) {}

  async verifyLoging(
    email: string,
    password: string
  ): Promise<Tockens | undefined> {
    try {
      console.log(email, "email");
      console.log(password, "password");

      const verifytheEmail = await this.userRepository.verifyEmail(email);

      const userinfo = await this.userRepository.findtheEmail(email, password);

      if (userinfo?.password) {
        const hashedpassword = await HashPassword.comparePassword(
          password,
          userinfo?.password
        );
        if (hashedpassword) {
          const userPayload: userPayload = {
            id: userinfo._id as ObjectId,
          };
          let accesstocken = generateAccessToken(userPayload);
          let refreshtocken = generateRefreshToken(userPayload);
          return { accesstocken, refreshtocken };
        } else {
          throw new Error("Wrong password");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async gettheIddetail(postId: string | any): Promise<void> {
    try {
      await this.userRepository.findIdAndDelete(postId);
    } catch (error) {
      console.log(error);
    }
  }

  async getAllthepost(): Promise<IPost[] | undefined> {
    try {
      const recieveallpost = await this.userRepository.findAllThePost();
      return recieveallpost;
    } catch (error) {
      console.log(error);
    }
  }

  async getpostForEdit(
    title: string,
    description: string,
    postimage: string | undefined,
    saveID: string
  ): Promise<void> {
    try {
      let cloudinaryImageUrl = "";
      if (postimage) {
        const result = await cloudinary.uploader.upload(postimage, {
          resource_type: "image",
          folder: "user_profiles",
          use_filename: true,
        });
        cloudinaryImageUrl = result.secure_url;
      }
      await this.userRepository.EditpostandSave(
        title,
        description,
        cloudinaryImageUrl,
        saveID
      );
    } catch (error) {
      console.log(error);
    }
  }

  async SendPostinfo(
    title: string,
    description: string,
    postimage: string | undefined
  ): Promise<void> {
    try {
      let cloudinaryImageUrl = "";
      if (postimage) {
        const result = await cloudinary.uploader.upload(postimage, {
          resource_type: "image",
          folder: "user_profiles",
          use_filename: true,
        });
        cloudinaryImageUrl = result.secure_url;

        await this.userRepository.savePostinfo(
          title,
          description,
          cloudinaryImageUrl
        );
      } else {
        console.error("Profile image is missing");
      }
    } catch (error) {}
  }

  async VerifyRegister(
    name: string,
    email: string,
    password: string,
    profileImage: string | undefined
  ): Promise<void> {
    try {
      let cloudinaryImageUrl = "";
      if (profileImage) {
        const result = await cloudinary.uploader.upload(profileImage, {
          resource_type: "image",
          folder: "user_profiles",
          use_filename: true,
        });
        cloudinaryImageUrl = result.secure_url;
      } else {
        console.error("Profile image is missing");
      }
      console.log(cloudinaryImageUrl, "image url");
      const checkemail = await this.userRepository.checkEmailExist(email);
      const hashedpassword = await HashPassword.hashPassword(password);
      const saveuserhere = await this.userRepository.savetheuser(
        name,
        email,
        hashedpassword,
        cloudinaryImageUrl
      );
    } catch (error) {
      console.log(error);
    }
  }
}


export default UserServices;