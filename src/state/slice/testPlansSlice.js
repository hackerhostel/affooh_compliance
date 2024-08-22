import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";

const initialState = {
    isTestPlanListForProjectError: false,
    isTestPlanListForProjectLoading: false,
    testPlanListForProject: [],
    selectedTestPlanId: 0,
};

export const doGetTestPlans = createAsyncThunk(
    'testPlans/getTestPlans',
    async (projectId, thunkApi) => {
        try {
            const response = await axios.get(`/projects/${projectId}/test-plans`)
            const responseData = response.data.body;

            if (responseData) {
                return responseData
            } else {
                return thunkApi.rejectWithValue('test plans not found');
            }
        } catch (error) {
            console.log(error)
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export const testPlansSlice = createSlice({
    name: 'testPlans',
    initialState,
    reducers: {
        setSelectedTestPlanId: (state, action) => {
            state.selectedTestPlanId = action.payload;
        },
        clearTestPlanState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(doGetTestPlans.pending, (state) => {
                state.isTestPlanListForProjectLoading = true;
            })
            .addCase(doGetTestPlans.fulfilled, (state, action) => {
                state.testPlanListForProject = action.payload;
                state.isTestPlanListForProjectLoading = false;
                state.isTestPlanListForProjectError = false;
            })
            .addCase(doGetTestPlans.rejected, (state, action) => {
                state.isTestPlanListForProjectLoading = false;
                state.isTestPlanListForProjectError = true;
            });
    },
});

export const {clearTestPlanState, setSelectedTestPlanId} = testPlansSlice.actions;

export const selectSelectedTestPlanId = (state) => state.testPlans?.selectedTestPlanId;
export const selectIsTestPlanListForProjectError = (state) => state?.testPlans?.isTestPlanListForProjectError;
export const selectIsTestPlanListForProjectLoading = (state) => state?.testPlans?.isTestPlanListForProjectLoading;
export const selectTestPlanListForProject = (state) => state?.testPlans?.testPlanListForProject;

export default testPlansSlice.reducer;
