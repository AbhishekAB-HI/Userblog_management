import { IPost, IReview, IUser } from "../../Entities/Userentities";



export interface Irepository {
  checkEmailExist(email: string): Promise<void>;
  EditpostandSave( title: string, description: string, cloudinaryImageUrl: string, saveID: string): Promise<void>
  savePostinfo(title: string,description: string,cloudinaryImageUrl: string): Promise<void>
  findIdAndDelete(postId: string | undefined): Promise<void>
  findAllThePost(
    string: string,
    limit: number,
    page: number
  ): Promise<{ posts: IPost[]; totalPages: number } | undefined> 
  findTheDetailPage(postId: string | undefined): Promise<IPost | null>
  findtheEmail(email: string,password: string): Promise<IUser | null | undefined>
  verifyEmail(email: string): Promise<void> 
  savetheuser(name: string,email: string,password: string,image: string): Promise<void>
 findPostAndUpdateReview(name: string,comment: string,rating: number,postId:string): Promise<void> 
findAllTheReviewFromRepo(postid: string): Promise<IReview[] | any>
}