
import { editPost } from "../API/Userapi";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { usePosts } from "./Posthook";


 export const postEditing = (saveID: string) => {
   const [Loading, setLoading] = useState(false);
   const [isEditOpen, setIsEditOpen] = useState(false);
     const { fetchAllPosts  } = usePosts();
   const validationSchema = Yup.object({
     title: Yup.string()
       .required("Title is required")
       .min(3, "Title must be at least 3 characters long"),
     description: Yup.string()
       .required("Description is required")
       .min(10, "Description must be at least 10 characters long"),
   });

   const formik = useFormik({
     initialValues: {
       title: "",
       description: "",
       productimage: null,
     },
     validationSchema,
     onSubmit: async (values) => {
       try {
         setLoading(true);
         const formData = new FormData();
         formData.append("title", values.title);
         formData.append("saveID", saveID);
         formData.append("description", values.description);
         if (values.productimage) {
           formData.append("productimage", values.productimage);
         }

         const { data } =await editPost(formData);

         if (data.message === "Post edited successful") {
           toast.success("Post edited successful");
          fetchAllPosts()
           setIsEditOpen(!isEditOpen);
         }
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     },
   });


return { formik, Loading, isEditOpen, setIsEditOpen };





 };