import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";

const initialState = {
    selectedRelease: undefined,
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
        setSelectedRelease: (state, action) => {
            state.selectedRelease = action.payload;
        },
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

export const {clearReleaseState, setSelectedRelease} = releaseSlice.actions;

export const selectSelectedRelease = (state) => state.release.selectedRelease;
export const selectIsReleaseListForProjectError = (state) => state?.release?.isReleaseListForProjectError;
export const selectIsReleaseListForProjectLoading = (state) => state?.release?.isReleaseListForProjectLoading;
export const selectReleaseListForProject = (state) => state?.release?.releaseListForProject;

export default releaseSlice.reducer;
