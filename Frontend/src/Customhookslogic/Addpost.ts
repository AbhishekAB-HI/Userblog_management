import { addPost, fetchPosts } from "../API/Userapi";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { usePosts } from "./Posthook";
import { IPost } from "../interfaces/Userinfo";

export const Postadding = () => {
    const [Loading1, setLoading1] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [posts, setPosts] = useState<IPost[]>([]);
    const { fetchAllPosts  } = usePosts();
    const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters long"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters long"),
  });

  const formik1 = useFormik({
    initialValues: {
      title: "",
      description: "",
      productuploadimage: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading1(true);
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        if (values.productuploadimage) {
          formData.append("productuploadimage", values.productuploadimage);
        }
        const { data } = await addPost(formData);
        if (data.message === "Upload the file") {
          toast.success("File upload successful");
          setIsOpen(!isOpen);
          fetchAllPosts();
        }
      } catch (error) {
        console.error(error);
        toast.error("File upload failed");
      } finally {
        setLoading1(false);
      }
    },
  });


  return { formik1, Loading1, isOpen, setIsOpen };



};
