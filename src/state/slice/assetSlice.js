import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  assets: [],
  selectedAsset: null,
  deviceConfig: null,
  assignmentHistory: [],
  masterData: {},
  loading: false,
  error: null,
  isAssetsLoading: false,
  isAssetsError: false,
  isAssetDetailLoading: false,
  isAssetDetailError: false,
  isCreateAssetLoading: false,
  isCreateAssetError: false,
  isUpdateAssetLoading: false,
  isUpdateAssetError: false,
  isDeleteAssetLoading: false,
  isDeleteAssetError: false,
  isMasterDataLoading: false,
  isMasterDataError: false,
  isDeviceConfigLoading: false,
  isDeviceConfigError: false,
  isAssignmentHistoryLoading: false,
  isAssignmentHistoryError: false,
  // Data Asset state
  dataAssets: [],
  selectedDataAsset: null,
  dataAssetMasterData: {},
  isDataAssetsLoading: false,
  isDataAssetsError: false,
  isDataAssetDetailLoading: false,
  isDataAssetDetailError: false,
  isCreateDataAssetLoading: false,
  isCreateDataAssetError: false,
  isUpdateDataAssetLoading: false,
  isUpdateDataAssetError: false,
  isDeleteDataAssetLoading: false,
  isDeleteDataAssetError: false,
  isDataMasterDataLoading: false,
  isDataMasterDataError: false,
  // Software Asset state
  softwareAssets: [],
  selectedSoftwareAsset: null,
  softwareMasterData: {},
  isSoftwareAssetsLoading: false,
  isSoftwareAssetsError: false,
  isSoftwareAssetDetailLoading: false,
  isSoftwareAssetDetailError: false,
  isCreateSoftwareAssetLoading: false,
  isCreateSoftwareAssetError: false,
  isUpdateSoftwareAssetLoading: false,
  isUpdateSoftwareAssetError: false,
  isDeleteSoftwareAssetLoading: false,
  isDeleteSoftwareAssetError: false,
  isSoftwareMasterDataLoading: false,
  isSoftwareMasterDataError: false,
};

// Async Thunks
export const doGetAssets = createAsyncThunk(
  "asset/getAssets",
  async ({ projectID, filters }, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/hardware/project/${projectID}`, {
        params: filters,
      });
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch assets"
      );
    }
  }
);

export const doGetAssetDetail = createAsyncThunk(
  "asset/getAssetDetail",
  async (assetID, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/hardware/detail/${assetID}`);
      return response.data.body.asset;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch asset detail"
      );
    }
  }
);

export const doCreateAsset = createAsyncThunk(
  "asset/createAsset",
  async (assetData, thunkAPI) => {
    try {
      const response = await axios.post("/assets/hardware", assetData);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create asset"
      );
    }
  }
);

export const doUpdateAsset = createAsyncThunk(
  "asset/updateAsset",
  async ({ assetID, assetData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `/assets/hardware/${assetID}`,
        assetData
      );
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update asset"
      );
    }
  }
);

export const doDeleteAsset = createAsyncThunk(
  "asset/deleteAsset",
  async (assetID, thunkAPI) => {
    try {
      await axios.delete(`/assets/hardware/${assetID}`);
      return assetID;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete asset"
      );
    }
  }
);

export const doGetMasterData = createAsyncThunk(
  "asset/getMasterData",
  async (projectID, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/master-data/${projectID}`);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch master data"
      );
    }
  }
);

export const doGetDeviceConfig = createAsyncThunk(
  "asset/getDeviceConfig",
  async (assetID, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/device-config/${assetID}`);
      return response.data.body.config;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch device config"
      );
    }
  }
);

export const doUpdateDeviceConfig = createAsyncThunk(
  "asset/updateDeviceConfig",
  async ({ assetID, configData }, thunkAPI) => {
    try {
      const response = await axios.post(
        `/assets/device-config/${assetID}`,
        configData
      );
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update device config"
      );
    }
  }
);

export const doGetAssignmentHistory = createAsyncThunk(
  "asset/getAssignmentHistory",
  async (assetID, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/assignments/asset/${assetID}`);
      return response.data.body.assignments;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch assignment history"
      );
    }
  }
);

export const doAssignUser = createAsyncThunk(
  "asset/assignUser",
  async (assignmentData, thunkAPI) => {
    try {
      const response = await axios.post("/assets/assignments", assignmentData);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to assign user"
      );
    }
  }
);

export const doReturnAsset = createAsyncThunk(
  "asset/returnAsset",
  async ({ assignmentID, returnData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `/assets/assignments/${assignmentID}/return`,
        returnData
      );
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to return asset"
      );
    }
  }
);

export const doUpdateAssignment = createAsyncThunk(
  "asset/updateAssignment",
  async ({ assignmentID, assignmentData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `/assets/assignments/${assignmentID}`,
        assignmentData
      );
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update assignment"
      );
    }
  }
);

// Data Asset Async Thunks
export const doGetDataAssets = createAsyncThunk(
  "asset/getDataAssets",
  async ({ projectID, filters }, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/data/project/${projectID}`, {
        params: filters,
      });
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch data assets"
      );
    }
  }
);

export const doGetDataAssetDetail = createAsyncThunk(
  "asset/getDataAssetDetail",
  async (assetID, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/data/detail/${assetID}`);
      return response.data.body.asset;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch data asset detail"
      );
    }
  }
);

export const doCreateDataAsset = createAsyncThunk(
  "asset/createDataAsset",
  async (assetData, thunkAPI) => {
    try {
      const response = await axios.post("/assets/data", assetData);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create data asset"
      );
    }
  }
);

export const doUpdateDataAsset = createAsyncThunk(
  "asset/updateDataAsset",
  async ({ assetID, assetData }, thunkAPI) => {
    try {
      const response = await axios.put(`/assets/data/${assetID}`, assetData);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update data asset"
      );
    }
  }
);

export const doDeleteDataAsset = createAsyncThunk(
  "asset/deleteDataAsset",
  async (assetID, thunkAPI) => {
    try {
      await axios.delete(`/assets/data/${assetID}`);
      return assetID;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete data asset"
      );
    }
  }
);

export const doGetDataMasterData = createAsyncThunk(
  "asset/getDataMasterData",
  async (projectID, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/data/master-data/${projectID}`);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch data master data"
      );
    }
  }
);

export const doGetRecipients = createAsyncThunk(
  "asset/getRecipients",
  async (assetID, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/data/${assetID}/recipients`);
      return response.data.body.recipients;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch recipients"
      );
    }
  }
);

export const doAddRecipients = createAsyncThunk(
  "asset/addRecipients",
  async ({ assetID, recipientData }, thunkAPI) => {
    try {
      const response = await axios.post(
        `/assets/data/${assetID}/recipients`,
        recipientData
      );
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add recipients"
      );
    }
  }
);

export const doRemoveRecipient = createAsyncThunk(
  "asset/removeRecipient",
  async ({ assetID, userID }, thunkAPI) => {
    try {
      await axios.delete(`/assets/data/${assetID}/recipients/${userID}`);
      return { assetID, userID };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to remove recipient"
      );
    }
  }
);

// Software Asset Async Thunks
export const doGetSoftwareAssets = createAsyncThunk(
  "asset/getSoftwareAssets",
  async ({ projectID, filters }, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/software/project/${projectID}`, {
        params: filters,
      });
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch software assets"
      );
    }
  }
);

export const doGetSoftwareAssetDetail = createAsyncThunk(
  "asset/getSoftwareAssetDetail",
  async (assetID, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/software/detail/${assetID}`);
      return response.data.body.asset;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch software asset detail"
      );
    }
  }
);

export const doCreateSoftwareAsset = createAsyncThunk(
  "asset/createSoftwareAsset",
  async (assetData, thunkAPI) => {
    try {
      const response = await axios.post("/assets/software", assetData);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create software asset"
      );
    }
  }
);

export const doUpdateSoftwareAsset = createAsyncThunk(
  "asset/updateSoftwareAsset",
  async ({ assetID, assetData }, thunkAPI) => {
    try {
      const response = await axios.put(`/assets/software/${assetID}`, assetData);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update software asset"
      );
    }
  }
);

export const doDeleteSoftwareAsset = createAsyncThunk(
  "asset/deleteSoftwareAsset",
  async (assetID, thunkAPI) => {
    try {
      await axios.delete(`/assets/software/${assetID}`);
      return assetID;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete software asset"
      );
    }
  }
);

export const doGetSoftwareMasterData = createAsyncThunk(
  "asset/getSoftwareMasterData",
  async (projectID, thunkAPI) => {
    try {
      const response = await axios.get(`/assets/software/master-data/${projectID}`);
      return response.data.body;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch software master data"
      );
    }
  }
);

// Slice
const assetSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    setSelectedAsset: (state, action) => {
      state.selectedAsset = action.payload;
    },
    clearAssets: (state) => {
      state.assets = [];
    },
    clearSelectedAsset: (state) => {
      state.selectedAsset = null;
    },
    clearDeviceConfig: (state) => {
      state.deviceConfig = null;
    },
    clearAssignmentHistory: (state) => {
      state.assignmentHistory = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    // Data Asset reducers
    setSelectedDataAsset: (state, action) => {
      state.selectedDataAsset = action.payload;
    },
    clearDataAssets: (state) => {
      state.dataAssets = [];
    },
    clearSelectedDataAsset: (state) => {
      state.selectedDataAsset = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Assets
      .addCase(doGetAssets.pending, (state) => {
        state.isAssetsLoading = true;
        state.isAssetsError = false;
        state.error = null;
      })
      .addCase(doGetAssets.fulfilled, (state, action) => {
        state.isAssetsLoading = false;
        state.assets = action.payload.assets || [];
      })
      .addCase(doGetAssets.rejected, (state, action) => {
        state.isAssetsLoading = false;
        state.isAssetsError = true;
        state.error = action.payload;
      })
      // Get Asset Detail
      .addCase(doGetAssetDetail.pending, (state) => {
        state.isAssetDetailLoading = true;
        state.isAssetDetailError = false;
        state.error = null;
      })
      .addCase(doGetAssetDetail.fulfilled, (state, action) => {
        state.isAssetDetailLoading = false;
        state.selectedAsset = action.payload;
      })
      .addCase(doGetAssetDetail.rejected, (state, action) => {
        state.isAssetDetailLoading = false;
        state.isAssetDetailError = true;
        state.error = action.payload;
      })
      // Create Asset
      .addCase(doCreateAsset.pending, (state) => {
        state.isCreateAssetLoading = true;
        state.isCreateAssetError = false;
        state.error = null;
      })
      .addCase(doCreateAsset.fulfilled, (state, action) => {
        state.isCreateAssetLoading = false;
      })
      .addCase(doCreateAsset.rejected, (state, action) => {
        state.isCreateAssetLoading = false;
        state.isCreateAssetError = true;
        state.error = action.payload;
      })
      // Update Asset
      .addCase(doUpdateAsset.pending, (state) => {
        state.isUpdateAssetLoading = true;
        state.isUpdateAssetError = false;
        state.error = null;
      })
      .addCase(doUpdateAsset.fulfilled, (state, action) => {
        state.isUpdateAssetLoading = false;
      })
      .addCase(doUpdateAsset.rejected, (state, action) => {
        state.isUpdateAssetLoading = false;
        state.isUpdateAssetError = true;
        state.error = action.payload;
      })
      // Delete Asset
      .addCase(doDeleteAsset.pending, (state) => {
        state.isDeleteAssetLoading = true;
        state.isDeleteAssetError = false;
        state.error = null;
      })
      .addCase(doDeleteAsset.fulfilled, (state, action) => {
        state.isDeleteAssetLoading = false;
        state.assets = state.assets.filter(
          (asset) => asset.id !== action.payload
        );
      })
      .addCase(doDeleteAsset.rejected, (state, action) => {
        state.isDeleteAssetLoading = false;
        state.isDeleteAssetError = true;
        state.error = action.payload;
      })
      // Get Master Data
      .addCase(doGetMasterData.pending, (state) => {
        state.isMasterDataLoading = true;
        state.isMasterDataError = false;
        state.error = null;
      })
      .addCase(doGetMasterData.fulfilled, (state, action) => {
        state.isMasterDataLoading = false;
        state.masterData = action.payload;
      })
      .addCase(doGetMasterData.rejected, (state, action) => {
        state.isMasterDataLoading = false;
        state.isMasterDataError = true;
        state.error = action.payload;
      })
      // Get Device Config
      .addCase(doGetDeviceConfig.pending, (state) => {
        state.isDeviceConfigLoading = true;
        state.error = null;
      })
      .addCase(doGetDeviceConfig.fulfilled, (state, action) => {
        state.isDeviceConfigLoading = false;
        state.deviceConfig = action.payload;
      })
      .addCase(doGetDeviceConfig.rejected, (state, action) => {
        state.isDeviceConfigLoading = false;
        state.error = action.payload;
      })
      // Update Device Config
      .addCase(doUpdateDeviceConfig.pending, (state) => {
        state.isDeviceConfigLoading = true;
        state.error = null;
      })
      .addCase(doUpdateDeviceConfig.fulfilled, (state) => {
        state.isDeviceConfigLoading = false;
      })
      .addCase(doUpdateDeviceConfig.rejected, (state, action) => {
        state.isDeviceConfigLoading = false;
        state.error = action.payload;
      })
      // Get Assignment History
      .addCase(doGetAssignmentHistory.pending, (state) => {
        state.isAssignmentHistoryLoading = true;
        state.error = null;
      })
      .addCase(doGetAssignmentHistory.fulfilled, (state, action) => {
        state.isAssignmentHistoryLoading = false;
        state.assignmentHistory = action.payload;
      })
      .addCase(doGetAssignmentHistory.rejected, (state, action) => {
        state.isAssignmentHistoryLoading = false;
        state.error = action.payload;
      })
      // Assign User
      .addCase(doAssignUser.pending, (state) => {
        state.error = null;
      })
      .addCase(doAssignUser.fulfilled, (state) => {
        // Assignment history will be refreshed
      })
      .addCase(doAssignUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Return Asset
      .addCase(doReturnAsset.pending, (state) => {
        state.error = null;
      })
      .addCase(doReturnAsset.fulfilled, (state) => {
        // Assignment history will be refreshed
      })
      .addCase(doReturnAsset.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update Assignment
      .addCase(doUpdateAssignment.pending, (state) => {
        state.error = null;
      })
      .addCase(doUpdateAssignment.fulfilled, (state) => {
        // Assignment history will be refreshed
      })
      .addCase(doUpdateAssignment.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Data Assets
      .addCase(doGetDataAssets.pending, (state) => {
        state.isDataAssetsLoading = true;
        state.isDataAssetsError = false;
        state.error = null;
      })
      .addCase(doGetDataAssets.fulfilled, (state, action) => {
        state.isDataAssetsLoading = false;
        state.dataAssets = action.payload.assets || [];
      })
      .addCase(doGetDataAssets.rejected, (state, action) => {
        state.isDataAssetsLoading = false;
        state.isDataAssetsError = true;
        state.error = action.payload;
      })
      // Get Data Asset Detail
      .addCase(doGetDataAssetDetail.pending, (state) => {
        state.isDataAssetDetailLoading = true;
        state.isDataAssetDetailError = false;
        state.error = null;
      })
      .addCase(doGetDataAssetDetail.fulfilled, (state, action) => {
        state.isDataAssetDetailLoading = false;
        state.selectedDataAsset = action.payload;
      })
      .addCase(doGetDataAssetDetail.rejected, (state, action) => {
        state.isDataAssetDetailLoading = false;
        state.isDataAssetDetailError = true;
        state.error = action.payload;
      })
      // Create Data Asset
      .addCase(doCreateDataAsset.pending, (state) => {
        state.isCreateDataAssetLoading = true;
        state.isCreateDataAssetError = false;
        state.error = null;
      })
      .addCase(doCreateDataAsset.fulfilled, (state) => {
        state.isCreateDataAssetLoading = false;
      })
      .addCase(doCreateDataAsset.rejected, (state, action) => {
        state.isCreateDataAssetLoading = false;
        state.isCreateDataAssetError = true;
        state.error = action.payload;
      })
      // Update Data Asset
      .addCase(doUpdateDataAsset.pending, (state) => {
        state.isUpdateDataAssetLoading = true;
        state.isUpdateDataAssetError = false;
        state.error = null;
      })
      .addCase(doUpdateDataAsset.fulfilled, (state) => {
        state.isUpdateDataAssetLoading = false;
      })
      .addCase(doUpdateDataAsset.rejected, (state, action) => {
        state.isUpdateDataAssetLoading = false;
        state.isUpdateDataAssetError = true;
        state.error = action.payload;
      })
      // Delete Data Asset
      .addCase(doDeleteDataAsset.pending, (state) => {
        state.isDeleteDataAssetLoading = true;
        state.isDeleteDataAssetError = false;
        state.error = null;
      })
      .addCase(doDeleteDataAsset.fulfilled, (state, action) => {
        state.isDeleteDataAssetLoading = false;
        state.dataAssets = state.dataAssets.filter(
          (asset) => asset.id !== action.payload
        );
      })
      .addCase(doDeleteDataAsset.rejected, (state, action) => {
        state.isDeleteDataAssetLoading = false;
        state.isDeleteDataAssetError = true;
        state.error = action.payload;
      })
      // Get Data Master Data
      .addCase(doGetDataMasterData.pending, (state) => {
        state.isDataMasterDataLoading = true;
        state.isDataMasterDataError = false;
        state.error = null;
      })
      .addCase(doGetDataMasterData.fulfilled, (state, action) => {
        state.isDataMasterDataLoading = false;
        state.dataAssetMasterData = action.payload;
      })
      .addCase(doGetDataMasterData.rejected, (state, action) => {
        state.isDataMasterDataLoading = false;
        state.isDataMasterDataError = true;
        state.error = action.payload;
      })
      // Get Software Assets
      .addCase(doGetSoftwareAssets.pending, (state) => {
        state.isSoftwareAssetsLoading = true;
        state.isSoftwareAssetsError = false;
        state.error = null;
      })
      .addCase(doGetSoftwareAssets.fulfilled, (state, action) => {
        state.isSoftwareAssetsLoading = false;
        state.softwareAssets = action.payload.assets || [];
      })
      .addCase(doGetSoftwareAssets.rejected, (state, action) => {
        state.isSoftwareAssetsLoading = false;
        state.isSoftwareAssetsError = true;
        state.error = action.payload;
      })
      // Get Software Asset Detail
      .addCase(doGetSoftwareAssetDetail.pending, (state) => {
        state.isSoftwareAssetDetailLoading = true;
        state.isSoftwareAssetDetailError = false;
        state.error = null;
      })
      .addCase(doGetSoftwareAssetDetail.fulfilled, (state, action) => {
        state.isSoftwareAssetDetailLoading = false;
        state.selectedSoftwareAsset = action.payload;
      })
      .addCase(doGetSoftwareAssetDetail.rejected, (state, action) => {
        state.isSoftwareAssetDetailLoading = false;
        state.isSoftwareAssetDetailError = true;
        state.error = action.payload;
      })
      // Create Software Asset
      .addCase(doCreateSoftwareAsset.pending, (state) => {
        state.isCreateSoftwareAssetLoading = true;
        state.isCreateSoftwareAssetError = false;
        state.error = null;
      })
      .addCase(doCreateSoftwareAsset.fulfilled, (state) => {
        state.isCreateSoftwareAssetLoading = false;
      })
      .addCase(doCreateSoftwareAsset.rejected, (state, action) => {
        state.isCreateSoftwareAssetLoading = false;
        state.isCreateSoftwareAssetError = true;
        state.error = action.payload;
      })
      // Update Software Asset
      .addCase(doUpdateSoftwareAsset.pending, (state) => {
        state.isUpdateSoftwareAssetLoading = true;
        state.isUpdateSoftwareAssetError = false;
        state.error = null;
      })
      .addCase(doUpdateSoftwareAsset.fulfilled, (state) => {
        state.isUpdateSoftwareAssetLoading = false;
      })
      .addCase(doUpdateSoftwareAsset.rejected, (state, action) => {
        state.isUpdateSoftwareAssetLoading = false;
        state.isUpdateSoftwareAssetError = true;
        state.error = action.payload;
      })
      // Delete Software Asset
      .addCase(doDeleteSoftwareAsset.pending, (state) => {
        state.isDeleteSoftwareAssetLoading = true;
        state.isDeleteSoftwareAssetError = false;
        state.error = null;
      })
      .addCase(doDeleteSoftwareAsset.fulfilled, (state, action) => {
        state.isDeleteSoftwareAssetLoading = false;
        state.softwareAssets = state.softwareAssets.filter(
          (asset) => asset.id !== action.payload
        );
      })
      .addCase(doDeleteSoftwareAsset.rejected, (state, action) => {
        state.isDeleteSoftwareAssetLoading = false;
        state.isDeleteSoftwareAssetError = true;
        state.error = action.payload;
      })
      // Get Software Master Data
      .addCase(doGetSoftwareMasterData.pending, (state) => {
        state.isSoftwareMasterDataLoading = true;
        state.isSoftwareMasterDataError = false;
        state.error = null;
      })
      .addCase(doGetSoftwareMasterData.fulfilled, (state, action) => {
        state.isSoftwareMasterDataLoading = false;
        state.softwareMasterData = action.payload;
      })
      .addCase(doGetSoftwareMasterData.rejected, (state, action) => {
        state.isSoftwareMasterDataLoading = false;
        state.isSoftwareMasterDataError = true;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedAsset,
  clearAssets,
  clearSelectedAsset,
  clearDeviceConfig,
  clearAssignmentHistory,
  clearError,
  setSelectedDataAsset,
  clearDataAssets,
  clearSelectedDataAsset,
} = assetSlice.actions;

export default assetSlice.reducer;
