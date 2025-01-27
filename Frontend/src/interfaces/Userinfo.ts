export interface IPost extends Document {
  _id: any;
  title: string;
  description: string;
  image: string;
  createdAt: any;
}

export interface IPost1 extends Document {
  _id: string;
  title: string;
  description: string;
}
export interface ExpandedPosts {
  [key: string]: boolean;
}

export interface PostsState {
  posts: IPost[];
  loading: boolean;
  error: string | null;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: Date;
}
export interface IAllReview {
  ReviewedBy: string;
  Rating: number;
  comment: string;
  _id: any;
  date:any
}

export interface ReviewComponentProps {
  postId: string;
}
