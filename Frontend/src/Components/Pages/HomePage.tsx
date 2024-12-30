import axiosInterseptor from "../../Services/Axiosinterceptor";
import { clearuserAccessTocken } from "../../Reduxstore/Reduxslice";
import {
  UserPlus,
  ChevronDown,
  Edit,
  Trash2,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IPost } from "../../interfaces/Userinfo";
import {  useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const UserManagementDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [savePost, setSavePost] = useState<IPost[]>([]);
  const [saveID, setSaveid] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
 const [Loading, setLoading] = useState(false)

 interface ExpandedPosts {
   [key: string]: boolean;
 }

 const [expandedPosts, setExpandedPosts] = useState<ExpandedPosts>({});

  // Toggle description expansion for a specific post
  const toggleDescription = (postId:any) => {
    setExpandedPosts((prev:any) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };


  useEffect(() => {
    findAllPost();
  }, []);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const handleLogout = () => {
    try {
      dispatch(clearuserAccessTocken());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

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
        setLoading(true)
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("saveID", saveID);
        formData.append("description", values.description);
        if (file) {
          formData.append("productimage", file);
        }

        const { data } = await axiosInterseptor.post(
          "https://userblog-management.onrender.com/api/user/editpost",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (data.message === "Post edited successful") {
          toast.success("Post edited successful");
          findAllPost();
          setIsEditOpen(!isEditOpen);
        }
      } catch (error) {
        console.error(error);
      }finally{
         setLoading(false);
      }
    },
  });

  const findAllPost = async () => {
    try {
      const { data } = await axiosInterseptor.get(
        "https://userblog-management.onrender.com/api/user/getpost"
      );

      if (data.message === "All post found") {
        setSavePost(data.Allpostrecived);
      }
    } catch (error) {
      console.log(error);
    }
  };



  const formik1 = useFormik({
    initialValues: {
      title: "",
      description: "",
      productimage: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
      console.log("Form submitted with values:", values);
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        console.log(file,"111111111111111111111111111111111")
        if (file) {
          formData.append("productimage", file);
        }

        const { data } = await axiosInterseptor.post(
          "https://userblog-management.onrender.com/api/user/addpost",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials:true
          },
          
        );

        if (data.message === "Upload the file") {
          toast.success("File upload successful");
          findAllPost();
          setIsOpen(!isOpen);
        }
      } catch (error) {
        console.error(error);
        toast.error("File upload failed");
      }
    },
  });


const handleDelete = async (userId: string) => {
  // Show confirmation dialog
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
  });

  // If confirmed, proceed with the delete action
  if (result.isConfirmed) {
    console.log("Delete user:", userId);
    try {
      const { data } = await axiosInterseptor.delete(
        `https://userblog-management.onrender.com/api/user/deletepost?id=${userId}`
      );

      if (data.message === "Post deleted successful") {
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
        findAllPost(); // Refresh the list of posts
      }
    } catch (error) {
      // Handle error (e.g., show an error message)
      Swal.fire("Error!", "Something went wrong. Please try again.", "error");
    }
  } else {
    // If cancelled
    Swal.fire("Cancelled", "The post was not deleted.", "info");
  }
};


  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const toggleEditModal = (id: string) => {
    setSaveid(id);
    setIsEditOpen(!isEditOpen);
  };

  const filteredPosts = savePost.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              User Blog Management
            </h1>
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={handleToggleDropdown}
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Account</span>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
              {isDropdownVisible && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-lg">
                  <button
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className=" mx-auto px-4 py-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input w-full border border-r-4 p-2"
        />

        {/* User Management Tools */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={toggleModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <UserPlus size={16} className="mr-2" />
                Add New Post
              </button>
            </div>

            {isOpen && (
              <div
                id="crud-modal"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex overflow-y-auto overflow-x-hidden"
              >
                <div className="relative p-4  w-full  border-black  max-w-md max-h-full">
                  {/* Modal content */}
                  <div className="relative border-2 bg-white rounded-lg shadow dark:bg-gray-50">
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-lg font-semibold text-black dark:text-black">
                        Create New Product
                      </h3>
                      <button
                        type="button"
                        onClick={toggleModal}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        <svg
                          className="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                    {/* Modal body */}
                    <form
                      onSubmit={formik1.handleSubmit}
                      className="p-4 md:p-5"
                    >
                      <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2">
                          <label
                            htmlFor="title"
                            className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-black"
                          >
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            onChange={formik1.handleChange}
                            onBlur={formik1.handleBlur}
                            className={`bg-gray-50 border ${
                              formik1.touched.title && formik1.errors.title
                                ? "border-red-500"
                                : "border-black"
                            } text-black text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-500`}
                            placeholder="Type product title"
                          />
                          {formik1.touched.title && formik1.errors.title && (
                            <p className="text-red-500 text-xs mt-1">
                              {formik1.errors.title}
                            </p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <label
                            htmlFor="description"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Product Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={4}
                            onChange={formik1.handleChange}
                            onBlur={formik1.handleBlur}
                            className={`bg-gray-50 border ${
                              formik1.touched.description &&
                              formik1.errors.description
                                ? "border-red-500"
                                : "border-black"
                            } text-black text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-500`}
                            placeholder="Write product description here"
                          ></textarea>
                          {formik1.touched.description &&
                            formik1.errors.description && (
                              <p className="text-red-500 text-xs mt-1">
                                {formik1.errors.description}
                              </p>
                            )}
                        </div>

                        <div className="flex items-center justify-center">
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex items-center justify-center mb-10 w-40 h-10 text-white bg-green-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg shadow-md"
                          >
                            <svg
                              className="w-4 h-5 mr-2 text-white"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm8 9a2 2 0 11-4 0 2 2 0 014 0zm2-4H6a1 1 0 000 2h8a1 1 0 100-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Upload File
                            <input
                              id="file-upload"
                              name="productimage"
                              type="file"
                              onChange={(e) => {
                                if (e.target.files) {
                                  setFile(e.target.files[0]);
                                  formik1.setFieldValue(
                                    "file",
                                    e.target.files[0]
                                  );
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        <svg
                          className="me-1 -ms-1 w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {Loading ? "Loading..." : " Add new product"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {isEditOpen && (
              <div
                id="crud-modal"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex overflow-y-auto overflow-x-hidden"
              >
                <div className="relative p-4  w-full  border-black  max-w-md max-h-full">
                  {/* Modal content */}
                  <div className="relative border-2 bg-white rounded-lg shadow dark:bg-gray-50">
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-lg font-semibold text-black dark:text-black">
                        Edit Product
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsEditOpen(!isEditOpen)}
                        className="text-gray-400 bg-transparent hover:bg-red-500 hover:text-red-500 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-600 dark:hover:text-white"
                      >
                        <svg
                          className="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                    {/* Modal body */}
                    <form onSubmit={formik.handleSubmit} className="p-4 md:p-5">
                      <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2">
                          <label
                            htmlFor="title"
                            className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-black"
                          >
                            Title
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title}
                            className="bg-gray-50 border border-black text-black text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Type product title"
                          />
                          {formik.touched.title && formik.errors.title && (
                            <p className="text-red-500 text-sm">
                              {formik.errors.title}
                            </p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <label
                            htmlFor="description"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Product Description
                          </label>
                          <textarea
                            id="description"
                            rows={4}
                            name="description"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-gray-50 border border-black text-black text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Write product description here"
                          ></textarea>
                          {formik.touched.description &&
                            formik.errors.description && (
                              <p className="text-red-500 text-sm">
                                {formik.errors.description}
                              </p>
                            )}
                        </div>

                        <div className="flex items-center justify-center">
                          <label
                            htmlFor="productimage"
                            className="cursor-pointer flex items-center justify-center mb-10 w-40 h-10 text-white bg-green-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg shadow-md"
                          >
                            <svg
                              className="w-4 h-5 mr-2 text-white"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm8 9a2 2 0 11-4 0 2 2 0 014 0zm2-4H6a1 1 0 000 2h8a1 1 0 100-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Upload File
                            <input
                              id="productimage"
                              name="productimage"
                              type="file"
                              onChange={(e) => {
                                if (e.target.files) {
                                  const file = e.target.files[0];
                                  setFile(file);
                                  formik.setFieldValue("productimage", file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>

                          {formik.touched.productimage &&
                            formik.errors.productimage && (
                              <p className="text-red-500 text-sm">
                                {formik.errors.productimage}
                              </p>
                            )}
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        {Loading ? "Loading..." : "Submit"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Users Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white border-black rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="p-6">
                    {/* Title and Actions */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p
                        className={`text-gray-600 text-sm ${
                          !expandedPosts[post._id] && "line-clamp-3"
                        }`}
                      >
                        {post.description}
                      </p>
                      {post.description.length > 150 && (
                        <button
                          onClick={() => toggleDescription(post._id)}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          {expandedPosts[post._id] ? (
                            <>
                              Show Less <ChevronUp size={16} />
                            </>
                          ) : (
                            <>
                              Read More <ChevronDown size={16} />
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Actions Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      {/* Edit/Delete Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleEditModal(post._id)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                          title="Edit post"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                          title="Delete post"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagementDashboard;
