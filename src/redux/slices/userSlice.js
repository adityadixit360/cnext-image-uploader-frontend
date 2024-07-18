import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: [],
    errors: null,
  },
  reducers: {
    logoutUser: (state, action) => {
      state.user = null;
    },
  },
});

export default userSlice;
