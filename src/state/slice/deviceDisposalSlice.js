import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  disposals: [],
  selectedDisposal: null,
  availableAssets: [],
  projectUsers: [],
  loading: false,
  error: null,
  isDisposalsLoading: false,
  isDisposalsError: false,
  isDisposalDetailLoading: false,
  isDisposalDetailError: false,
  isCreateDisposalLoading: false,
  isCreateDisposalError: false,
  isUpdateDisposalLoading: false,
  isUpdateDisposalError: false,
  isDeleteDisposalLoading: false,
  isDeleteDisposalError: false,
  isApproveDisposalLoading: false,
  isApproveDisposalError: false,
  isAvailableAssetsLoading: false,
  isProjectUsersLoading: false,
};

export const doGetDisposals = createAsyncThunk(
  "deviceDisposal/getDisposals",
  async ({ projectID, filters }, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/disposals/project/${projectID}`, {
        params: filters,
      });
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch disposals"
      );
    }
  }
);

export const doGetDisposalDetail = createAsyncThunk(
  "deviceDisposal/getDisposalDetail",
  async (disposalID, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/disposals/detail/${disposalID}`);
      return response.data.body.disposal;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch disposal detail"
      );
    }
  }
);

export const doCreateDisposal = createAsyncThunk(
  "deviceDisposal/createDisposal",
  async (disposalData, thunkAPI) => {
    try {
      const response = await axios.post("/assets/disposals", disposalData);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create disposal"
      );
    }
  }
);

export const doUpdateDisposal = createAsyncThunk(
  "deviceDisposal/updateDisposal",
  async ({ disposalID, disposalData }, thunkAPI) => {
    try {
      const response = await axios.put(`/assets/disposals/${disposalID}`, disposalData);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update disposal"
      );
    }
  }
);

export const doDeleteDisposal = createAsyncThunk(
  "deviceDisposal/deleteDisposal",
  async (disposalID, thunkAPI) => {
    try {
      await axios.delete(`/assets/disposals/${disposalID}`);
      return disposalID;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete disposal"
      );
    }
  }
);

export const doApproveDisposal = createAsyncThunk(
  "deviceDisposal/approveDisposal",
  async (disposalID, thunkAPI) => {
    try {
      const response = await axios.post(`/assets/disposals/${disposalID}/approve`);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to approve disposal"
      );
    }
  }
);

export const doGetAvailableAssets = createAsyncThunk(
  "deviceDisposal/getAvailableAssets",
  async ({ projectID, searchTerm }, thunkAPI) => {
    try {
      const params = {};
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await axios.get(`/assets/disposals/assets/${projectID}`, {
        params,
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
  "deviceDisposal/getProjectUsers",
  async ({ projectID, searchTerm }, thunkAPI) => {
    try {
      const projectIdNum = Number(projectID);
      if (!projectID || isNaN(projectIdNum) || projectIdNum <= 0) {
        return thunkAPI.rejectWithValue({
          error: "Invalid project ID",
          message: `Project ID must be a valid positive number. Received: ${projectID}`,
        });
      }

      const url = `/assets/disposals/users/${projectIdNum}`;
      const params = {};
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await axios.get(url, {
        params,
      });

      if (response.data?.body?.users) {
        return response.data.body.users;
      } else if (Array.isArray(response.data?.body)) {
        return response.data.body;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          error: "Failed to fetch project users",
          message: error.message,
        }
      );
    }
  }
);

const deviceDisposalSlice = createSlice({
  name: "deviceDisposal",
  initialState,
  reducers: {
    setSelectedDisposal: (state, action) => {
      state.selectedDisposal = action.payload;
    },
    clearDisposals: (state) => {
      state.disposals = [];
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
      .addCase(doGetDisposals.pending, (state) => {
        state.isDisposalsLoading = true;
        state.isDisposalsError = false;
      })
      .addCase(doGetDisposals.fulfilled, (state, action) => {
        state.isDisposalsLoading = false;
        state.disposals = action.payload.disposals || [];
      })
      .addCase(doGetDisposals.rejected, (state, action) => {
        state.isDisposalsLoading = false;
        state.isDisposalsError = true;
        state.error = action.payload;
      })
      .addCase(doGetDisposalDetail.pending, (state) => {
        state.isDisposalDetailLoading = true;
        state.isDisposalDetailError = false;
      })
      .addCase(doGetDisposalDetail.fulfilled, (state, action) => {
        state.isDisposalDetailLoading = false;
        state.selectedDisposal = action.payload;
      })
      .addCase(doGetDisposalDetail.rejected, (state, action) => {
        state.isDisposalDetailLoading = false;
        state.isDisposalDetailError = true;
        state.error = action.payload;
      })
      .addCase(doCreateDisposal.pending, (state) => {
        state.isCreateDisposalLoading = true;
        state.isCreateDisposalError = false;
      })
      .addCase(doCreateDisposal.fulfilled, (state) => {
        state.isCreateDisposalLoading = false;
      })
      .addCase(doCreateDisposal.rejected, (state, action) => {
        state.isCreateDisposalLoading = false;
        state.isCreateDisposalError = true;
        state.error = action.payload;
      })
      .addCase(doUpdateDisposal.pending, (state) => {
        state.isUpdateDisposalLoading = true;
        state.isUpdateDisposalError = false;
      })
      .addCase(doUpdateDisposal.fulfilled, (state) => {
        state.isUpdateDisposalLoading = false;
      })
      .addCase(doUpdateDisposal.rejected, (state, action) => {
        state.isUpdateDisposalLoading = false;
        state.isUpdateDisposalError = true;
        state.error = action.payload;
      })
      .addCase(doDeleteDisposal.pending, (state) => {
        state.isDeleteDisposalLoading = true;
        state.isDeleteDisposalError = false;
      })
      .addCase(doDeleteDisposal.fulfilled, (state, action) => {
        state.isDeleteDisposalLoading = false;
        state.disposals = state.disposals.filter((d) => d.id !== action.payload);
      })
      .addCase(doDeleteDisposal.rejected, (state, action) => {
        state.isDeleteDisposalLoading = false;
        state.isDeleteDisposalError = true;
        state.error = action.payload;
      })
      .addCase(doApproveDisposal.pending, (state) => {
        state.isApproveDisposalLoading = true;
        state.isApproveDisposalError = false;
      })
      .addCase(doApproveDisposal.fulfilled, (state, action) => {
        state.isApproveDisposalLoading = false;
        const index = state.disposals.findIndex(
          (d) => d.id === action.payload.disposalID
        );
        if (index !== -1) {
          state.disposals[index].status = "Approved";
          state.disposals[index].approvedDate = new Date().toISOString();
        }
      })
      .addCase(doApproveDisposal.rejected, (state, action) => {
        state.isApproveDisposalLoading = false;
        state.isApproveDisposalError = true;
        state.error = action.payload;
      })
      .addCase(doGetAvailableAssets.pending, (state) => {
        state.isAvailableAssetsLoading = true;
      })
      .addCase(doGetAvailableAssets.fulfilled, (state, action) => {
        state.isAvailableAssetsLoading = false;
        state.availableAssets = action.payload || [];
      })
      .addCase(doGetAvailableAssets.rejected, (state) => {
        state.isAvailableAssetsLoading = false;
        state.availableAssets = [];
      })
      .addCase(doGetProjectUsers.pending, (state) => {
        state.isProjectUsersLoading = true;
        state.error = null;
      })
      .addCase(doGetProjectUsers.fulfilled, (state, action) => {
        state.isProjectUsersLoading = false;
        state.projectUsers = action.payload || [];
        state.error = null;
      })
      .addCase(doGetProjectUsers.rejected, (state, action) => {
        state.isProjectUsersLoading = false;
        state.projectUsers = [];
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedDisposal,
  clearDisposals,
  clearAvailableAssets,
  clearProjectUsers,
} = deviceDisposalSlice.actions;

export default deviceDisposalSlice.reducer;
