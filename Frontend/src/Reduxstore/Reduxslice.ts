import { IPost } from "../interfaces/Userinfo";
import {  createSlice } from "@reduxjs/toolkit";

type userstate = {
  userTocken: string;
  userRefreshTocken: string;
  savePosts:IPost[]
};


const stateinfo: userstate = {
  userTocken: localStorage.getItem("usertocken") || "",
  userRefreshTocken: localStorage.getItem("userRefreshTocken") || "",
  savePosts:[]
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
     setSaveposts:(state,action)=>{
      const posts =action.payload
      state.savePosts = posts;
     }
   },
 });



   export const {
     setUserAccessTocken,
     setUserRefreshtocken,
     clearuserAccessTocken,
     setSaveposts,
   } = userTockeninfo.actions;

  export const userTockenStatus = userTockeninfo.reducer

















