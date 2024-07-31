import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import contentSlice from "./slices/contentSlice";
import loadingSlice from "./slices/loadingSlice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    content: contentSlice.reducer,
    loading:loadingSlice.reducer
  },
});

export default store;
