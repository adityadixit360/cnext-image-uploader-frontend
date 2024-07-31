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
    clearFoldersData: (state, action) => {
      state.folders = [];
    },
  },
  //   extraReducers: (builder) => {},
});

export const { allFoldersData, clearFoldersData } = contentSlice.actions;

export default contentSlice;
