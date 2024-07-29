import { createSlice } from "@reduxjs/toolkit";

const contentSlice = createSlice({
  name: "content",
  initialState: {
    folders: [],
  },
  reducers: {
    allFoldersData: (state, action) => {
      state.folders = action.payload;
    },
  },
  //   extraReducers: (builder) => {},
});

export const { allFoldersData } = contentSlice.actions;

export default contentSlice;
