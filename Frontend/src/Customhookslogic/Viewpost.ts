import { fetchOnePost } from "../API/Userapi";
import { IPost } from "../interfaces/Userinfo";
import { useState } from "react";
import toast from "react-hot-toast";


 export const viewPost = () => {
  const [posts, setPosts] = useState<IPost>();
  const fetchViewPage = async (postid: string | undefined) => {
    try {
      const { data } = await fetchOnePost(postid);
      if(data.message ==="All posts found"){
          setPosts(data.Allpostrecived);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts.");
    }
  };

   return { fetchViewPage, posts };



};
