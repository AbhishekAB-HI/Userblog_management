import { useState } from "react";
import { fetchPosts } from "../API/Userapi";
import { IPost } from "../interfaces/Userinfo";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setSaveposts } from "../Reduxstore/Reduxslice";

export const usePosts = (search:string  ) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const dispatch = useDispatch()
  const fetchAllPosts = async () => {
  try {
    const { data } = await fetchPosts(search);
    dispatch(setSaveposts(data.Allpostrecived));
  } catch (error) {
    console.error("Error fetching posts:", error);
    toast.error("Failed to fetch posts.");
  }
};


  return { posts, setPosts, fetchAllPosts };
};
