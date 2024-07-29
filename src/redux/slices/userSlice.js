import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: [],
    errors: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = [];
    },
    userDetails: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { logoutUser, userDetails } = userSlice.actions;
export default userSlice;
