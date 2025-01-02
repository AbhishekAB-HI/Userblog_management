import { deletePost } from "../API/Userapi";
import Swal from "sweetalert2";



 export const handleDelete = async (userId: string, fetchAllPosts:any ) => {
   const result = await Swal.fire({
     title: "Are you sure?",
     text: "This action cannot be undone.",
     icon: "warning",
     showCancelButton: true,
     confirmButtonText: "Yes, delete it!",
     cancelButtonText: "No, cancel!",
   });
   if (result.isConfirmed) {
     console.log("Delete user:", userId);
     try {
       const { data } = await deletePost(userId);
       if (data.message === "Post deleted successful") {
         Swal.fire("Deleted!", "Your post has been deleted.", "success");
         fetchAllPosts();
       }
     } catch (error) {
       Swal.fire("Error!", "Something went wrong. Please try again.", "error");
     }
   } else {
     Swal.fire("Cancelled", "The post was not deleted.", "info");
   }
 };