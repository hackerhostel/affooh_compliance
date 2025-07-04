import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  taskType: [],
  loading: false,
  error: null,
};


export const fetchAllTaskTypes = createAsyncThunk(
  "taskType/fetchAllTaskTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/task-types"); 
      return response.data.taskTypes || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


const taskTypeSlice = createSlice({
  name: "taskType",
  initialState,
  reducers: {
    clearTaskType: (state) => {
      state.taskType = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTaskTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTaskTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.taskType = action.payload;
      })
      .addCase(fetchAllTaskTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { clearTaskType } = taskTypeSlice.actions;

export const selectTaskType = (state) => state.taskType.taskType;
export const selectTaskTypeLoading = (state) => state.taskType.loading;
export const selectTaskTypeError = (state) => state.taskType.error;

export default taskTypeSlice.reducer;
