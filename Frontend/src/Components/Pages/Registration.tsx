import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";

const Registration: React.FC = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required("Name is required")
      .test(
        "is-not-only-spaces",
        "Name cannot be only spaces",
        (value) => !!value && value.trim().length > 0
      ),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
      profileImage: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        if (values.profileImage) {
          formData.append("profileImage", values.profileImage);
        }

        const { data } = await axios.post(
          `https://userblog-management.onrender.com/api/user/register`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (data.message === "User Saved Successfull") {
          toast.success("User Registration Successful");
          navigate("/login");
        } else {
          toast.error("Registration failed");
        }
      } catch (error) {
        console.log("Error while submitting registration form:", error);
        toast.error("An error occurred during registration");
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="block text-gray-700 text-lg font-bold mb-5">
            Create Account
          </h1>

          {/* Name Field */}
          <div className="mb-4">
            <label
              className="block text-left text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border mb-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              {...formik.getFieldProps("name")}
              placeholder="Enter your name"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs">{formik.errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label
              className="block text-left text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              {...formik.getFieldProps("email")}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs">{formik.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              className="block text-left text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              {...formik.getFieldProps("password")}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs">{formik.errors.password}</p>
            )}

            <label
              className="block text-left text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmpassword"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmpassword"
              type="password"
              {...formik.getFieldProps("confirmpassword")}
              placeholder="Confirm your password"
            />
            {formik.touched.confirmpassword &&
              formik.errors.confirmpassword && (
                <p className="text-red-500 text-xs">
                  {formik.errors.confirmpassword}
                </p>
              )}
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <input
              type="file"
              required
              name="profileImage"
              onChange={(event) => {
                const file = event.target.files ? event.target.files[0] : null;
                formik.setFieldValue("profileImage", file);
              }}
              className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-700"
            />
            {formik.errors.profileImage && (
              <p className="text-red-500 text-xs">
                {formik.errors.profileImage}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              SIGN UP
            </button>
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">
            Already have an account?{" "}
            <Link
              className="font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/login"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
