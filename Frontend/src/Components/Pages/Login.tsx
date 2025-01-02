import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../Reusablecomponents/FormLogin";
import Button from "../../Reusablecomponents/Button";
import useLogin from "../../Customhookslogic/Loginhook";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const { handleLogin, Loading } = useLogin();

 const validationSchema = Yup.object({
   email: Yup.string()
     .email("Invalid email format")
     .required("Email is required"),
   password: Yup.string()
     .min(8, "Password must be at least 8 characters long")
     .matches(/[a-z]/, "Password must contain at least one lowercase letter")
     .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
     .matches(/[0-9]/, "Password must contain at least one number")
     .matches(/[\W_]/, "Password must contain at least one special character")
     .required("Password is required"),
 });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      handleLogin(values.email, values.password);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="block text-gray-700 text-lg font-bold mb-5">LOGIN</h1>
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formik.values.email}
            error={formik.errors.email}
            touched={formik.touched.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formik.values.password}
            error={formik.errors.password}
            touched={formik.touched.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className="flex items-center justify-center">
            {Loading ? (
              <Button type="button" label="Loading..." />
            ) : (
              <Button type="submit" label="LOG IN" />
            )}
          </div>
          <p className="text-center text-gray-500 text-xs">
            Create an account?{" "}
            <Link className="text-blue-500 hover:text-blue-800" to="/register">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
