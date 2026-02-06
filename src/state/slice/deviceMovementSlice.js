import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  movements: [],
  selectedMovement: null,
  availableAssets: [],
  projectUsers: [],
  loading: false,
  error: null,
  isMovementsLoading: false,
  isMovementsError: false,
  isMovementDetailLoading: false,
  isMovementDetailError: false,
  isCreateMovementLoading: false,
  isCreateMovementError: false,
  isUpdateMovementLoading: false,
  isUpdateMovementError: false,
  isDeleteMovementLoading: false,
  isDeleteMovementError: false,
  isApproveMovementLoading: false,
  isApproveMovementError: false,
  isAvailableAssetsLoading: false,
  isAvailableAssetsError: false,
  isProjectUsersLoading: false,
  isProjectUsersError: false,
};

// Async Thunks
export const doGetMovements = createAsyncThunk(
  "deviceMovement/getMovements",
  async ({ projectID, filters }, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/movements/project/${projectID}`, {
        params: filters,
      });
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch movements"
      );
    }
  }
);

export const doGetMovementDetail = createAsyncThunk(
  "deviceMovement/getMovementDetail",
  async (movementID, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/movements/detail/${movementID}`);
      return response.data.body.movement;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch movement detail"
      );
    }
  }
);

export const doCreateMovement = createAsyncThunk(
  "deviceMovement/createMovement",
  async (movementData, thunkAPI) => {
    try {
      const response = await axios.post("/assets/movements", movementData);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create movement"
      );
    }
  }
);

export const doUpdateMovement = createAsyncThunk(
  "deviceMovement/updateMovement",
  async ({ movementID, movementData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `/assets/movements/${movementID}`,
        movementData
      );
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update movement"
      );
    }
  }
);

export const doApproveMovement = createAsyncThunk(
  "deviceMovement/approveMovement",
  async (movementID, thunkAPI) => {
    try {
      const response = await axios.post(`/assets/movements/${movementID}/approve`);
      return { movementID, ...response.data.body };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to approve movement"
      );
    }
  }
);

export const doDeleteMovement = createAsyncThunk(
  "deviceMovement/deleteMovement",
  async (movementID, thunkAPI) => {
    try {
      await axios.delete(`/assets/movements/${movementID}`);
      return movementID;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete movement"
      );
    }
  }
);

export const doGetAvailableAssets = createAsyncThunk(
  "deviceMovement/getAvailableAssets",
  async ({ projectID, searchTerm }, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/movements/assets/${projectID}`, {
        params: { search: searchTerm },
      });
      return response.data.body.assets;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch available assets"
      );
    }
  }
);

export const doGetProjectUsers = createAsyncThunk(
  "deviceMovement/getProjectUsers",
  async ({ projectID, searchTerm }, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/movements/users/${projectID}`, {
        params: { search: searchTerm },
      });
      return response.data.body.users;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch project users"
      );
    }
  }
);

// Slice
const deviceMovementSlice = createSlice({
  name: "deviceMovement",
  initialState,
  reducers: {
    setSelectedMovement: (state, action) => {
      state.selectedMovement = action.payload;
    },
    clearMovements: (state) => {
      state.movements = [];
    },
    clearAvailableAssets: (state) => {
      state.availableAssets = [];
    },
    clearProjectUsers: (state) => {
      state.projectUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Movements
      .addCase(doGetMovements.pending, (state) => {
        state.isMovementsLoading = true;
        state.isMovementsError = false;
        state.loading = true;
      })
      .addCase(doGetMovements.fulfilled, (state, action) => {
        state.movements = action.payload.movements || [];
        state.isMovementsLoading = false;
        state.isMovementsError = false;
        state.loading = false;
      })
      .addCase(doGetMovements.rejected, (state, action) => {
        state.isMovementsLoading = false;
        state.isMovementsError = true;
        state.error = action.payload;
        state.loading = false;
      })
      // Get Movement Detail
      .addCase(doGetMovementDetail.pending, (state) => {
        state.isMovementDetailLoading = true;
        state.isMovementDetailError = false;
      })
      .addCase(doGetMovementDetail.fulfilled, (state, action) => {
        state.selectedMovement = action.payload;
        state.isMovementDetailLoading = false;
        state.isMovementDetailError = false;
      })
      .addCase(doGetMovementDetail.rejected, (state, action) => {
        state.isMovementDetailLoading = false;
        state.isMovementDetailError = true;
        state.error = action.payload;
      })
      // Create Movement
      .addCase(doCreateMovement.pending, (state) => {
        state.isCreateMovementLoading = true;
        state.isCreateMovementError = false;
      })
      .addCase(doCreateMovement.fulfilled, (state) => {
        state.isCreateMovementLoading = false;
        state.isCreateMovementError = false;
      })
      .addCase(doCreateMovement.rejected, (state, action) => {
        state.isCreateMovementLoading = false;
        state.isCreateMovementError = true;
        state.error = action.payload;
      })
      // Update Movement
      .addCase(doUpdateMovement.pending, (state) => {
        state.isUpdateMovementLoading = true;
        state.isUpdateMovementError = false;
      })
      .addCase(doUpdateMovement.fulfilled, (state) => {
        state.isUpdateMovementLoading = false;
        state.isUpdateMovementError = false;
      })
      .addCase(doUpdateMovement.rejected, (state, action) => {
        state.isUpdateMovementLoading = false;
        state.isUpdateMovementError = true;
        state.error = action.payload;
      })
      // Approve Movement
      .addCase(doApproveMovement.pending, (state) => {
        state.isApproveMovementLoading = true;
        state.isApproveMovementError = false;
      })
      .addCase(doApproveMovement.fulfilled, (state, action) => {
        const index = state.movements.findIndex(
          (m) => m.id === action.payload.movementID
        );
        if (index !== -1) {
          state.movements[index].status = "Approved";
          state.movements[index].approvedDate = new Date().toISOString();
          if (action.payload.approvedBy) {
            state.movements[index].approvedBy = action.payload.approvedBy;
          }
        }
        state.isApproveMovementLoading = false;
        state.isApproveMovementError = false;
      })
      .addCase(doApproveMovement.rejected, (state, action) => {
        state.isApproveMovementLoading = false;
        state.isApproveMovementError = true;
        state.error = action.payload;
      })
      // Delete Movement
      .addCase(doDeleteMovement.pending, (state) => {
        state.isDeleteMovementLoading = true;
        state.isDeleteMovementError = false;
      })
      .addCase(doDeleteMovement.fulfilled, (state, action) => {
        state.movements = state.movements.filter(
          (m) => m.id !== action.payload
        );
        state.isDeleteMovementLoading = false;
        state.isDeleteMovementError = false;
      })
      .addCase(doDeleteMovement.rejected, (state, action) => {
        state.isDeleteMovementLoading = false;
        state.isDeleteMovementError = true;
        state.error = action.payload;
      })
      // Get Available Assets
      .addCase(doGetAvailableAssets.pending, (state) => {
        state.isAvailableAssetsLoading = true;
        state.isAvailableAssetsError = false;
      })
      .addCase(doGetAvailableAssets.fulfilled, (state, action) => {
        state.availableAssets = action.payload || [];
        state.isAvailableAssetsLoading = false;
        state.isAvailableAssetsError = false;
      })
      .addCase(doGetAvailableAssets.rejected, (state, action) => {
        state.isAvailableAssetsLoading = false;
        state.isAvailableAssetsError = true;
        state.error = action.payload;
      })
      // Get Project Users
      .addCase(doGetProjectUsers.pending, (state) => {
        state.isProjectUsersLoading = true;
        state.isProjectUsersError = false;
      })
      .addCase(doGetProjectUsers.fulfilled, (state, action) => {
        state.projectUsers = action.payload || [];
        state.isProjectUsersLoading = false;
        state.isProjectUsersError = false;
      })
      .addCase(doGetProjectUsers.rejected, (state, action) => {
        state.isProjectUsersLoading = false;
        state.isProjectUsersError = true;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedMovement,
  clearMovements,
  clearAvailableAssets,
  clearProjectUsers,
} = deviceMovementSlice.actions;
export default deviceMovementSlice.reducer;
