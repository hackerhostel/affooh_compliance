import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from "axios";

const initialState = {
  appConfig: {},
  initialDataLoading: true,
  initialDataError: false,
}

export const doGetMasterData = createAsyncThunk(
  'src/app/doGetMasterData', async (_, thunkApi) =>
  {
  try {
    const response = await axios.get('/organizations/master-data')

    const responseData = response.data;
    if (responseData) {
      return responseData;
    } else {
      return thunkApi.rejectWithValue('app details not found');
    }
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    clearAppState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(doGetMasterData.pending, (state, action) => {
      state.initialDataLoading = true;
    });
    builder.addCase(doGetMasterData.fulfilled, (state, action) => {
      state.initialDataLoading = false;
      state.initialDataError = false;
      state.appConfig = action.payload
    });
    builder.addCase(doGetMasterData.rejected, (state, action) => {
      state.initialDataError = true;
    });
  }
})

export const {clearAppState} = appSlice.actions

export const selectAppConfig = (state) => state.app.appConfig;
export const selectInitialDataLoading = (state) => state.app.initialDataLoading;
export const selectInitialDataError = (state) => state.app.initialDataError;

export default appSlice.reducer