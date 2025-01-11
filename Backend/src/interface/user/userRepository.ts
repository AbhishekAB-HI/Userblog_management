import { IPost, IUser } from "../../Entities/Userentities";



export interface Irepository {
  checkEmailExist(email: string): Promise<void>;
  EditpostandSave( title: string, description: string, cloudinaryImageUrl: string, saveID: string): Promise<void>
  savePostinfo(title: string,description: string,cloudinaryImageUrl: string): Promise<void>
  findIdAndDelete(postId: string | undefined): Promise<void>
  findAllThePost(search:string | any): Promise<IPost[] | undefined>
  findTheDetailPage(postId: string | undefined): Promise<IPost | null>
  findtheEmail(email: string,password: string): Promise<IUser | null | undefined>
  verifyEmail(email: string): Promise<void> 
  savetheuser(name: string,email: string,password: string,image: string): Promise<void>

  
}