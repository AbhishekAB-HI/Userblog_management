import { clearuserAccessTocken } from "../../Reduxstore/Reduxslice";
import { UserPlus, ChevronDown, Edit, Trash2, ChevronUp, FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ExpandedPosts, IPost1 } from "../../interfaces/Userinfo";
import { usePosts } from "../../Customhookslogic/Posthook";
import { Postadding } from "../../Customhookslogic/Addpost";
import { postEditing } from "../../Customhookslogic/Editpost";
import { handleDelete } from "../../Customhookslogic/DeletePost";
import { store } from "../../Reduxstore/Reduxstore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import DOMPurify from "dompurify";
const UserManagementDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [saveID, setSaveid] = useState("");
  const [postinfo, setPostinfo] = useState<Partial<IPost1>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPosts, setExpandedPosts] = useState<ExpandedPosts>({});
  const { Loading1, formik1, isOpen, setIsOpen } = Postadding();
  const { formik, Loading, isEditOpen, setIsEditOpen } = postEditing(saveID);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  type RootState = ReturnType<typeof store.getState>;
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const { fetchAllPosts, totalPages } = usePosts(searchQuery);




  useEffect(() => {
    if (postinfo && postinfo._id) {
      formik.setValues({
        title: postinfo.title || "",
        description: postinfo.description || "",
        productimage: null,
      });
    }
  }, [postinfo]); // This effect runs every time postinfo changes

  const quillModules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "align",
  ];

  useEffect(() => {
    fetchAllPosts(currentPage, postsPerPage);
  }, [searchQuery, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    try {
      fetchAllPosts();
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [searchQuery]);

  const getpost = useSelector(
    (state: RootState) => state.accessStore.savePosts
  );

  const toggleDescription = (postId: any) => {
    setExpandedPosts((prev: any) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

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

  const handleViewPage = (postid: string) => {
    try {
      console.log(postid, "postid");
      navigate(`/viewpage/${postid}`);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
    formik1.setFieldValue("description", "");
    formik1.setFieldValue("title", "");
  };

  const toggleEditModal = (id: string, description: string, title: string) => {
    setSaveid(id);
    const obj: Partial<IPost1> = {
      _id: id,
      title: title,
      description: description,
    };

    setPostinfo(obj);
    setIsEditOpen(!isEditOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Blog folio</h1>
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
                  <div className="relative border-2 bg-white rounded-lg shadow dark:bg-gray-50">
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

                    <form
                      onSubmit={formik1.handleSubmit}
                      className="p-4 md:p-5"
                    >
                      <div className="grid gap-4 mb-4 grid-cols-2">
                        {/* Title Field */}
                        <div className="col-span-2">
                          <label
                            htmlFor="title"
                            className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-black"
                          >
                            Title
                          </label>
                          <ReactQuill
                            value={formik1.values.title }
                            onChange={(value) =>
                              formik1.setFieldValue("title", value)
                            }
                            onBlur={() =>
                              formik1.setFieldTouched("title", true)
                            }
                            theme="snow"
                            modules={quillModules}
                            formats={quillFormats}
                            className={`custom-quill ${
                              formik1.touched.title && formik1.errors.title
                                ? "border-red-500"
                                : "border-black"
                            } text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-white dark:border-gray-500`}
                            placeholder="Type product title"
                          />
                          {formik1.touched.title && formik1.errors.title && (
                            <p className="text-red-500 text-xs mt-1">
                              {formik1.errors.title}
                            </p>
                          )}
                        </div>

                        {/* Description Field */}
                        <div className="col-span-2">
                          <label
                            htmlFor="description"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Product Description
                          </label>
                          <ReactQuill
                            value={formik1.values.description}
                            onChange={(value) =>
                              formik1.setFieldValue("description", value)
                            }
                            onBlur={() =>
                              formik1.setFieldTouched("description", true)
                            }
                            theme="snow"
                            modules={quillModules}
                            formats={quillFormats}
                            className={`custom-quill ${
                              formik1.touched.description &&
                              formik1.errors.description
                                ? "border-red-500"
                                : "border-black"
                            } text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-white dark:border-gray-500`}
                            placeholder="Write product description here"
                          />
                          {formik1.touched.description &&
                            formik1.errors.description && (
                              <p className="text-red-500 text-xs mt-1">
                                {formik1.errors.description}
                              </p>
                            )}
                        </div>

                        {/* Upload Button */}
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
                              name="productuploadimage"
                              type="file"
                              onChange={(e) => {
                                if (e.target.files) {
                                  formik1.setFieldValue(
                                    "productuploadimage",
                                    e.target.files[0]
                                  );
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {formik1.errors.productuploadimage &&
                          formik1.touched.productuploadimage && (
                            <div className="text-red-500 text-sm">
                              {formik1.errors.productuploadimage}
                            </div>
                          )}
                      </div>

                      {/* Submit Button */}
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
                        {Loading1 ? "Loading..." : " Add new product"}
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
                  <div className="relative border-2 bg-white rounded-lg shadow dark:bg-gray-50">
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

                    <form onSubmit={formik.handleSubmit} className="p-4 md:p-5">
                      <div className="grid gap-4 mb-4 grid-cols-2">
                        {/* Title Field */}
                        <div className="col-span-2">
                          <label
                            htmlFor="title"
                            className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-black"
                          >
                            Title
                          </label>
                          <ReactQuill
                            value={formik.values.title}
                            onChange={(value) =>
                              formik.setFieldValue("title", value)
                            }
                            onBlur={() => formik.setFieldTouched("title", true)}
                            theme="snow"
                            className={`custom-quill ${
                              formik.touched.title && formik.errors.title
                                ? "border-red-500"
                                : "border-black"
                            } text-black rounded-lg`}
                            placeholder="Type product title"
                          />
                          {formik.touched.title && formik.errors.title && (
                            <p className="text-red-500 text-sm">
                              {formik.errors.title}
                            </p>
                          )}
                        </div>

                        {/* Description Field */}
                        <div className="col-span-2">
                          <label
                            htmlFor="description"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Product Description
                          </label>
                          <ReactQuill
                            value={formik.values.description}
                            onChange={(value) =>
                              formik.setFieldValue("description", value)
                            }
                            onBlur={() =>
                              formik.setFieldTouched("description", true)
                            }
                            theme="snow"
                            className={`custom-quill ${
                              formik.touched.description &&
                              formik.errors.description
                                ? "border-red-500"
                                : "border-black"
                            } text-black rounded-lg`}
                            placeholder="Write product description here"
                          />
                          {formik.touched.description &&
                            formik.errors.description && (
                              <p className="text-red-500 text-sm">
                                {formik.errors.description}
                              </p>
                            )}
                        </div>

                        {/* Upload Button */}
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
                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        {Loading ? "Loading..." : "Submit"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getpost.length > 0 ? (
                getpost?.map((post, index) => (
                  <div
                    key={index}
                    className="bg-white border-black rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <div
                      onClick={(event) => {
                        event.preventDefault();
                        handleViewPage(post._id);
                      }}
                      className="relative h-48 overflow-hidden"
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6">
                      {/* Title */}
                      <div className="flex justify-between items-start mb-3">
                        <h3
                          className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(post.title),
                          }}
                        />
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <div
                          className={`text-gray-600 text-sm ${
                            !expandedPosts[post._id] && "line-clamp-3"
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(post.description),
                          }}
                        />
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

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              toggleEditModal(
                                post._id,
                                post.description,
                                post.title
                              )
                            }
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                            title="Edit post"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(post._id, fetchAllPosts)
                            }
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                            title="Delete post"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <FolderOpen className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Posts Found
                  </h3>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    There are no blog posts to display at the moment. Create
                    your first post to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 mx-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserManagementDashboard;
