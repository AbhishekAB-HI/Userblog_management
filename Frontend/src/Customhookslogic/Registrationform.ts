import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUser } from "../API/Userapi";
import toast from "react-hot-toast";
import { API_MESSAGES } from "../Messages/Apimessages";
import { useState } from "react";

  export const useRegistrationForm = (navigate: Function) => {
    const [Loading, setLoading] = useState(false);

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
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[\W_]/, "Password must contain at least one special character")
      .required("Password is required"),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
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
        setLoading(true);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("confirmpassword", values.confirmpassword);
        if (values.profileImage) {
          formData.append("profileImage", values.profileImage);
        }

        const { data } = await registerUser(formData);
        if (data.message === "User Saved Successfull") {
          toast.success(API_MESSAGES.REGISTRATION_SUCCESS);
          navigate("/login");
        } else {
          toast.error(API_MESSAGES.REGISTRATION_FAILED);
        }
      } catch (error) {
        console.error("Registration error:", error);
        toast.error(API_MESSAGES.ERROR_OCCURRED);
      } finally {
        setLoading(false);
      }
    },
  });
  
  return { formik, Loading };

  
};



