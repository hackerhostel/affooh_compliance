import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {generateClient} from 'aws-amplify/api';
import {fetchAuthSession} from 'aws-amplify/auth';
import {getTestPlan} from '../../graphql/TestPlanQueries/queries.js';

const initialState = {
    isTestPlanDetailsError: false,
    isTestPlanDetailsLoading: false,
    selectedTestPlan: null,
};

export const doGetTestPlan = createAsyncThunk(
    'testPlan/getTestPlan',
    async (testPlanID, thunkApi) => {
        try {
            const client = generateClient();

            const session = await fetchAuthSession();
            const authToken = session?.tokens?.idToken;

            if (!authToken) {
                throw new Error('Failed to retrieve auth token');
            }

            const testPlanResponse = await client.graphql({
                query: getTestPlan,
                variables: {testPlanID},
                authToken,
            });

            if (!testPlanResponse?.data?.getTestPlan) {
                throw new Error('Test Plan not found');
            }

            return testPlanResponse.data.getTestPlan;
        } catch (error) {
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export const testPlanSlice = createSlice({
    name: 'testPlan',
    initialState,
    reducers: {
        clearTestPlanState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(doGetTestPlan.pending, (state) => {
                state.isTestPlanDetailsLoading = true;
            })
            .addCase(doGetTestPlan.fulfilled, (state, action) => {
                state.selectedTestPlan = action.payload;
                state.isTestPlanDetailsLoading = false;
                state.isTestPlanDetailsError = false;
            })
            .addCase(doGetTestPlan.rejected, (state, action) => {
                state.isTestPlanDetailsLoading = false;
                state.isTestPlanDetailsError = true;
            });
    },
});

export const {clearTestPlanState} = testPlanSlice.actions;

export const selectIsTestPlanDetailsError = (state) => state?.testPlan?.isTestPlanDetailsError;
export const selectIsTestPlanDetailsLoading = (state) => state?.testPlan?.isTestPlanDetailsLoading;
export const selectSelectedTestPlan = (state) => state?.testPlan?.selectedTestPlan;

export default testPlanSlice.reducer;
