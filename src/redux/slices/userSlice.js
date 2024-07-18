import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: [],
    errors: null,
  },
  reducers: {},
});

export default userSlice;
