import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
  setUserAccessTocken,
  setUserRefreshtocken,
} from "../../Reduxstore/Reduxslice";

const Loginpage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          `http://localhost:3000/api/user/login`,
          {
            email: values.email,
            password: values.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (data.message === "User Logined Successful") {
          toast.success("User Logined Successful");
          dispatch(setUserAccessTocken(data.accessToc));
          dispatch(setUserRefreshtocken(data.refreshToc));
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error during login:", error);
        toast.error("Login failed. Please try again.");
      }
    },
  });

  return (
    <div className="flex items-center justify-center  min-h-screen ">
      <div className="w-full max-w-sm">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <h1 className="block text-gray-700 text-lg font-bold mb-5">
              LOGIN
            </h1>
            <label
              className="block text-left text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : ""
              }`}
              id="email"
              type="email"
              {...formik.getFieldProps("email")}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs italic">
                {formik.errors.email}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-left text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={`shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : ""
              }`}
              id="password"
              type="password"
              {...formik.getFieldProps("password")}
              placeholder="******************"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs italic">
                {formik.errors.password}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 mb-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              LOG IN
            </button>
          </div>
          <label className="text-center text-gray-500 text-xs" htmlFor="">
            Create an account ?
          </label>
          <Link
            className="inline-block align-baseline font-bold text-sm ml-1 text-blue-500 hover:text-blue-800"
            to="/register"
          >
            Sign Up
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Loginpage;
