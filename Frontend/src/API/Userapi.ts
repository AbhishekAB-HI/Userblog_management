import { API_ENDPOINTS } from "../Messages/Apimessages";
import axiosInterseptor from "../Services/Axiosinterceptor.ts";

export const registerUser = async (formData: FormData) => {
  return axiosInterseptor.post(API_ENDPOINTS.REGISTER, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const loginUser = async (email: string, password: string) => {
  return axiosInterseptor.post(API_ENDPOINTS.LOG_IN, { email, password });
};

export const fetchPosts = async () => {
  return await axiosInterseptor.get(API_ENDPOINTS.GET_POST);
};

export const addPost = async (formData: FormData) => {
  return await axiosInterseptor.post(API_ENDPOINTS.ADD_POST, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const editPost = async (formData: FormData) => {
  return await axiosInterseptor.post(API_ENDPOINTS.EDIT_POST, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePost = async (postId: string) => {
  return await axiosInterseptor.delete(
    `${API_ENDPOINTS.DELETE_POST}?id=${postId}`
  );
};



