import userBlogSchema from "../Models/Userblogschema.ts";
import { IPost, IUser } from "../Entities/Userentities.ts";
import postSchemaDetail from "../Models/PostSchema.ts";
import { Irepository } from "../interface/user/userRepository.ts";

class UserRepository implements Irepository {
  async checkEmailExist(email: string): Promise<void> {
    try {
      const checkemail = await userBlogSchema.findOne({ email: email });
      if (checkemail) {
        throw new Error("Email is already exists");
      }
    } catch (error) {
      throw new Error("Cannot find Email");
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
      throw new Error("Cannot find post while editing");
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
      throw new Error("Cannot find post while saving");
    }
  }

  async findIdAndDelete(postId: string | undefined): Promise<void> {
    try {
      const getinfo = await postSchemaDetail.findByIdAndDelete(postId);
    } catch (error) {
      throw new Error("Cannot find post while delete");
    }
  }

  async findTheDetailPage(postId: string): Promise<IPost | null> {
    try {
      const filterpost = await postSchemaDetail.findById(postId);
      return filterpost;
    } catch (error) {
      throw new Error("Cannot find posts");
    }
  }
  async findAllThePost(
    string: string,
    limit: number,
    page: number
  ): Promise<{ posts: IPost[]; totalPages: number } | undefined> {
    try {
      // Calculate the skip value based on the current page and limit
      const skip = (page - 1) * limit;

      // Count total posts matching the search query
      const totalPosts = await postSchemaDetail.countDocuments({
        $or: [
          { title: { $regex: string, $options: "i" } },
          { description: { $regex: string, $options: "i" } },
        ],
      });

      // Fetch the posts with pagination and sorting by createdAt in descending order
      const posts = await postSchemaDetail
        .find({
          $or: [
            { title: { $regex: string, $options: "i" } },
            { description: { $regex: string, $options: "i" } },
          ],
        })
        .skip(skip) // Skip posts based on pagination
        .limit(limit) // Limit the number of posts returned
        .sort({ createdAt: -1 }); // Sort by createdAt in descending order (latest first)

      // Calculate total pages
      const totalPages = Math.ceil(totalPosts / limit);

      return { posts, totalPages };
    } catch (error) {
      throw new Error("Cannot find posts");
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
      throw new Error("Cannot find post");
    }
  }

  async verifyEmail(email: string): Promise<void> {
    try {
      const EmailVerify = await userBlogSchema.findOne({ email: email });

      if (!EmailVerify) {
        throw new Error("No user found");
      }
    } catch (error) {
      throw new Error("Cannot find post");
    }
  }

  async savetheuser(
    name: string,
    email: string,
    password: string,
    image: string
  ): Promise<void> {
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
      throw new Error("Cannot find user while saving");
    }
  }
}

export default UserRepository;
