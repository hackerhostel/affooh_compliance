import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  cloudAssets: [],
  selectedCloudAsset: null,
  masterData: {},
  loading: false,
  error: null,
  isCloudAssetsLoading: false,
  isCloudAssetsError: false,
  isCloudAssetDetailLoading: false,
  isCloudAssetDetailError: false,
  isCreateCloudAssetLoading: false,
  isCreateCloudAssetError: false,
  isUpdateCloudAssetLoading: false,
  isUpdateCloudAssetError: false,
  isDeleteCloudAssetLoading: false,
  isDeleteCloudAssetError: false,
  isMasterDataLoading: false,
  isMasterDataError: false,
};

// Async Thunks
export const doGetCloudAssets = createAsyncThunk(
  "cloudAsset/getCloudAssets",
  async ({ projectID, filters }, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/cloud/project/${projectID}`, {
        params: filters,
      });
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch cloud assets"
      );
    }
  }
);

export const doGetCloudAssetDetail = createAsyncThunk(
  "cloudAsset/getCloudAssetDetail",
  async (assetID, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/cloud/detail/${assetID}`);
      return response.data.body.asset;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch cloud asset detail"
      );
    }
  }
);

export const doCreateCloudAsset = createAsyncThunk(
  "cloudAsset/createCloudAsset",
  async (assetData, thunkAPI) => {
    try {
      const response = await axios.post("/assets/cloud", assetData);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create cloud asset"
      );
    }
  }
);

export const doUpdateCloudAsset = createAsyncThunk(
  "cloudAsset/updateCloudAsset",
  async ({ assetID, assetData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `/assets/cloud/${assetID}`,
        assetData
      );
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update cloud asset"
      );
    }
  }
);

export const doDeleteCloudAsset = createAsyncThunk(
  "cloudAsset/deleteCloudAsset",
  async (assetID, thunkAPI) => {
    try {
      await axios.delete(`/assets/cloud/${assetID}`);
      return assetID;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete cloud asset"
      );
    }
  }
);

export const doGetCloudMasterData = createAsyncThunk(
  "cloudAsset/getCloudMasterData",
  async (projectID, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/cloud/master-data/${projectID}`);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch master data"
      );
    }
  }
);

// Slice
const cloudAssetSlice = createSlice({
  name: "cloudAsset",
  initialState,
  reducers: {
    setSelectedCloudAsset: (state, action) => {
      state.selectedCloudAsset = action.payload;
    },
    clearCloudAssets: (state) => {
      state.cloudAssets = [];
    },
    clearSelectedCloudAsset: (state) => {
      state.selectedCloudAsset = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cloud Assets
      .addCase(doGetCloudAssets.pending, (state) => {
        state.isCloudAssetsLoading = true;
        state.isCloudAssetsError = false;
        state.error = null;
      })
      .addCase(doGetCloudAssets.fulfilled, (state, action) => {
        state.isCloudAssetsLoading = false;
        state.cloudAssets = action.payload.assets || [];
      })
      .addCase(doGetCloudAssets.rejected, (state, action) => {
        state.isCloudAssetsLoading = false;
        state.isCloudAssetsError = true;
        state.error = action.payload;
      })
      // Get Cloud Asset Detail
      .addCase(doGetCloudAssetDetail.pending, (state) => {
        state.isCloudAssetDetailLoading = true;
        state.isCloudAssetDetailError = false;
        state.error = null;
      })
      .addCase(doGetCloudAssetDetail.fulfilled, (state, action) => {
        state.isCloudAssetDetailLoading = false;
        state.selectedCloudAsset = action.payload;
      })
      .addCase(doGetCloudAssetDetail.rejected, (state, action) => {
        state.isCloudAssetDetailLoading = false;
        state.isCloudAssetDetailError = true;
        state.error = action.payload;
      })
      // Create Cloud Asset
      .addCase(doCreateCloudAsset.pending, (state) => {
        state.isCreateCloudAssetLoading = true;
        state.isCreateCloudAssetError = false;
        state.error = null;
      })
      .addCase(doCreateCloudAsset.fulfilled, (state, action) => {
        state.isCreateCloudAssetLoading = false;
      })
      .addCase(doCreateCloudAsset.rejected, (state, action) => {
        state.isCreateCloudAssetLoading = false;
        state.isCreateCloudAssetError = true;
        state.error = action.payload;
      })
      // Update Cloud Asset
      .addCase(doUpdateCloudAsset.pending, (state) => {
        state.isUpdateCloudAssetLoading = true;
        state.isUpdateCloudAssetError = false;
        state.error = null;
      })
      .addCase(doUpdateCloudAsset.fulfilled, (state, action) => {
        state.isUpdateCloudAssetLoading = false;
      })
      .addCase(doUpdateCloudAsset.rejected, (state, action) => {
        state.isUpdateCloudAssetLoading = false;
        state.isUpdateCloudAssetError = true;
        state.error = action.payload;
      })
      // Delete Cloud Asset
      .addCase(doDeleteCloudAsset.pending, (state) => {
        state.isDeleteCloudAssetLoading = true;
        state.isDeleteCloudAssetError = false;
        state.error = null;
      })
      .addCase(doDeleteCloudAsset.fulfilled, (state, action) => {
        state.isDeleteCloudAssetLoading = false;
        state.cloudAssets = state.cloudAssets.filter(
          (asset) => asset.id !== action.payload
        );
      })
      .addCase(doDeleteCloudAsset.rejected, (state, action) => {
        state.isDeleteCloudAssetLoading = false;
        state.isDeleteCloudAssetError = true;
        state.error = action.payload;
      })
      // Get Master Data
      .addCase(doGetCloudMasterData.pending, (state) => {
        state.isMasterDataLoading = true;
        state.isMasterDataError = false;
        state.error = null;
      })
      .addCase(doGetCloudMasterData.fulfilled, (state, action) => {
        state.isMasterDataLoading = false;
        state.masterData = action.payload;
      })
      .addCase(doGetCloudMasterData.rejected, (state, action) => {
        state.isMasterDataLoading = false;
        state.isMasterDataError = true;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedCloudAsset,
  clearCloudAssets,
  clearSelectedCloudAsset,
  clearError,
} = cloudAssetSlice.actions;

export default cloudAssetSlice.reducer;
