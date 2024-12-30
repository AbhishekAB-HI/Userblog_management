import { createSlice } from "@reduxjs/toolkit";

type userstate = {
  userTocken: string;
  userRefreshTocken: string;
};


const stateinfo: userstate = {
  userTocken: localStorage.getItem("usertocken") || "",
  userRefreshTocken: localStorage.getItem("userRefreshTocken") || "",
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
   },
 });



   export const { setUserAccessTocken, setUserRefreshtocken, clearuserAccessTocken } =
     userTockeninfo.actions;

  export const userTockenStatus = userTockeninfo.reducer

















