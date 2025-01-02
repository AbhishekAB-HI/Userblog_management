import React from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../../Reusablecomponents/Formregistration";
import { useRegistrationForm } from "../../Customhookslogic/Registrationform";

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const {formik ,Loading}= useRegistrationForm(navigate);

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
          <FormField
            id="name"
            label="Name"
            type="text"
            value={formik.values.name}
            error={formik.errors.name}
            touched={formik.touched.name}
            onChange={formik.handleChange}
            placeholder="Enter your name"
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            value={formik.values.email}
            error={formik.errors.email}
            touched={formik.touched.email}
            onChange={formik.handleChange}
            placeholder="Enter your email"
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            value={formik.values.password}
            error={formik.errors.password}
            touched={formik.touched.password}
            onChange={formik.handleChange}
            placeholder="Enter your password"
          />
          <FormField
            id="confirmpassword"
            label="Confirm Password"
            type="password"
            value={formik.values.confirmpassword}
            error={formik.errors.confirmpassword}
            touched={formik.touched.confirmpassword}
            onChange={formik.handleChange}
            placeholder="Confirm your password"
          />
          <div className="mb-6">
            <input
              type="file"
              name="profileImage"
              onChange={(event) => {
                const file = event.target.files ? event.target.files[0] : null;
                formik.setFieldValue("profileImage", file);
              }}
              className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-700"
            />
          </div>
          <div className="flex items-center justify-center">
            {Loading ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={formik.isSubmitting}
              >
              Loading....
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={formik.isSubmitting}
              >
                SIGN UP
              </button>
            )}
           
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
