import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";

const initialState = {
    isReleaseListForProjectError: false,
    isReleaseListForProjectLoading: false,
    releaseListForProject: []
};

export const doGetReleases = createAsyncThunk(
    'release/getReleases',
    async (projectId, thunkApi) => {
        try {
            const response = await axios.get(`/projects/${projectId}/releases`)
            const responseData = response.data.releases;

            if (responseData) {
                return responseData
            } else {
                return thunkApi.rejectWithValue('Releases not found');
            }
        } catch (error) {
            console.log(error)
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export const releaseSlice = createSlice({
    name: 'release',
    initialState,
    reducers: {
        clearReleaseState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(doGetReleases.pending, (state) => {
                state.isReleaseListForProjectLoading = true;
            })
            .addCase(doGetReleases.fulfilled, (state, action) => {
                state.releaseListForProject = action.payload;
                state.isReleaseListForProjectLoading = false;
                state.isReleaseListForProjectError = false;
            })
            .addCase(doGetReleases.rejected, (state, action) => {
                state.isReleaseListForProjectLoading = false;
                state.isReleaseListForProjectError = true;
            });
    },
});

export const {clearReleaseState} = releaseSlice.actions;

export const selectIsReleaseListForProjectError = (state) => state?.release?.isReleaseListForProjectError;
export const selectIsReleaseListForProjectLoading = (state) => state?.release?.isReleaseListForProjectLoading;
export const selectReleaseListForProject = (state) => state?.release?.releaseListForProject;

export default releaseSlice.reducer;
