import { IPost } from "../interfaces/Userinfo";
import {  createSlice } from "@reduxjs/toolkit";

type userstate = {
  userTocken: string;
  userRefreshTocken: string;
  savePosts:IPost[] 
  savePost:IPost | null
};

let initialPosts: IPost[] = [];
const savedPosts = localStorage.getItem("saveposts");

if (savedPosts) {
  try {
    
    initialPosts = JSON.parse(savedPosts);
  } catch (error) {
    console.error("Failed to parse saveposts:", error);
    localStorage.removeItem("saveposts"); // Clear invalid data
  }
}



const stateinfo: userstate = {
  userTocken: localStorage.getItem("usertocken") || "",
  userRefreshTocken: localStorage.getItem("userRefreshTocken") || "",
  savePosts: initialPosts,
  savePost: null,
};


 const userTockeninfo = createSlice({
   name: "Tocken",
   initialState: stateinfo,
   reducers: {
     setUserAccessTocken: (state, action) => {
       const Tocken = action.payload;
       state.userTocken = Tocken;
       localStorage.setItem("usertocken", Tocken);
     },
     setUserRefreshtocken: (state, action) => {
       const refreshTocken = action.payload;
       state.userRefreshTocken = refreshTocken;
       localStorage.setItem("userRefreshTocken", refreshTocken);
     },
     clearuserAccessTocken: (state) => {
       state.userTocken = "";
       state.userRefreshTocken = "";
       localStorage.removeItem("usertocken");
     },
     setSaveposts: (state, action) => {
       state.savePosts = [...action.payload];
       localStorage.setItem("saveposts", JSON.stringify(action.payload));
     },
     setSavepost: (state, action) => {
       const posts = action.payload;
       state.savePosts = posts;
     },
   },
 });



   export const {
     setUserAccessTocken,
     setUserRefreshtocken,
     clearuserAccessTocken,
     setSaveposts,
     setSavepost
   } = userTockeninfo.actions;

  export const userTockenStatus = userTockeninfo.reducer

















