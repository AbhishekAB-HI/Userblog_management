import { configureStore } from "@reduxjs/toolkit";

import { userTockenStatus } from "./Reduxslice";

export const store = configureStore({
  reducer: {
    accessStore: userTockenStatus,
  },
});
