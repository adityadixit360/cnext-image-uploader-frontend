import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import contentSlice from "./slices/contentSlice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    content: contentSlice.reducer,
  },
});

export default store;
