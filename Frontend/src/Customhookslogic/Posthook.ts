import { useState } from "react";
import { fetchPosts } from "../API/Userapi";
import { IPost } from "../interfaces/Userinfo";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setSaveposts } from "../Reduxstore/Reduxslice";
export const usePosts = (search: string) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();

  const fetchAllPosts = async (page = 1, limit = 6) => {
    try {
      const { data } = await fetchPosts(search, page, limit);
      dispatch(setSaveposts(data.posts));
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts.");
    }
  };

  return { posts, setPosts, fetchAllPosts, totalPages };
};

