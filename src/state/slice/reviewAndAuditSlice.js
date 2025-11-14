import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCreating: false,
  isUpdating: false,
  selectedDocument: null,
  documentToUpdate: null,
};

const reviewUISlice = createSlice({
  name: "reviewUI",
  initialState,
  reducers: {
    openCreate: (state) => {
      state.isCreating = true;
    },
    closeCreate: (state) => {
      state.isCreating = false;
    },
    selectDocument: (state, action) => {
      state.selectedDocument = action.payload;
      state.isUpdating = false;
      state.documentToUpdate = null;
    },
    startUpdate: (state, action) => {
      state.documentToUpdate = action.payload;
      state.isUpdating = true;
      // keep selectedDocument as-is (or you can also set selectedDocument = null)
    },
    closeUpdate: (state) => {
      state.isUpdating = false;
      state.documentToUpdate = null;
    },
    finishUpdate: (state, action) => {
      state.selectedDocument = action.payload;
      state.isUpdating = false;
      state.documentToUpdate = null;
    },
  },
});

export const {
  openCreate,
  closeCreate,
  selectDocument,
  startUpdate,
  closeUpdate,
  finishUpdate,
} = reviewUISlice.actions;

export default reviewUISlice.reducer;