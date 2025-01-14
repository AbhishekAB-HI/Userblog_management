export interface IPost extends Document {
  _id: any;
  title: string;
  description: string;
  image: string;
  createdAt:any
}

export interface ExpandedPosts {
  [key: string]: boolean;
}

 export interface PostsState {
  posts: IPost[];
  loading: boolean;
  error: string | null;
}