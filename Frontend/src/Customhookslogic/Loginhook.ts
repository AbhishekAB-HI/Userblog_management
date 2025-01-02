import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  setUserAccessTocken,
  setUserRefreshtocken,
} from "../Reduxstore/Reduxslice";
import { loginUser } from "../API/Userapi";
import axios from "axios";
import { useState } from "react";

const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data } = await loginUser(email, password);
      if (data.message === "User Logined Successful") {
        toast.success("User Logined Successful");
        dispatch(setUserAccessTocken(data.accessToc));
        dispatch(setUserRefreshtocken(data.refreshToc));
        navigate("/dashboard");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
     if (axios.isAxiosError(error)) {
       const errorMessage =
         error.response?.data?.message || "An error occurred";
       toast.error(errorMessage);
     } else {
       toast.error("Unknown error occurred");
     }
     console.error("Error :", error);
    }finally{
       setLoading(false);
    }
  };

  return { handleLogin, Loading };
};

export default useLogin;
