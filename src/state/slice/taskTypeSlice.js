import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  taskTypes: [],
  selectedTaskTypeId: null,
  loading: false,
  error: null,
};

// Fetch All Task Types
export const fetchAllTaskTypes = createAsyncThunk(
  "taskType/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/task-types");
      return response.data.taskTypes || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Create Task Type
export const createTaskType = createAsyncThunk(
  "taskType/create",
  async (taskTypeData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/task-types", taskTypeData);
      return response.data.taskType || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Delete Task Type
export const deleteTaskType = createAsyncThunk(
  "taskType/delete",
  async (taskTypeId, { rejectWithValue }) => {
    try {
      await axios.delete(`/task-types/${taskTypeId}`);
      return taskTypeId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const taskTypeSlice = createSlice({
  name: "taskType",
  initialState,
  reducers: {
    setSelectedTaskTypeId: (state, action) => {
      state.selectedTaskTypeId = action.payload;
    },
    clearSelectedTaskTypeId: (state) => {
      state.selectedTaskTypeId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllTaskTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTaskTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.taskTypes = action.payload;
      })
      .addCase(fetchAllTaskTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createTaskType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTaskType.fulfilled, (state, action) => {
        state.loading = false;
        state.taskTypes.push(action.payload);
      })
      .addCase(createTaskType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteTaskType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskType.fulfilled, (state, action) => {
        state.loading = false;
        state.taskTypes = state.taskTypes.filter(
          (type) => type.id !== action.payload
        );
      })
      .addCase(deleteTaskType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTaskTypeId, clearSelectedTaskTypeId } =
  taskTypeSlice.actions;

// Selectors
export const selectTaskTypes = (state) => state.taskType.taskTypes;
export const selectTaskTypeLoading = (state) => state.taskType.loading;
export const selectTaskTypeError = (state) => state.taskType.error;

export default taskTypeSlice.reducer;
