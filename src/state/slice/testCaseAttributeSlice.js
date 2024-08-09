import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {generateClient} from 'aws-amplify/api';
import {fetchAuthSession} from 'aws-amplify/auth';
import {getTestCaseFormData} from "../../graphql/testcaseQueries/queries.js";

const initialState = {
    isTestCaseAttributeError: false,
    isTestCaseAttributeLoading: false,
    testCaseStatuses: [],
    testCasePriorities: [],
    testCaseCategories: [],
};

export const doGetTestCaseAttribute = createAsyncThunk(
    'testCaseAttribute/getTestCaseAttribute',
    async (projectID, thunkApi) => {
        try {
            console.log("testCaseAttributeResponse")

            const client = generateClient();
            const session = await fetchAuthSession();
            const authToken = session?.tokens?.idToken;

            if (!authToken) {
                throw new Error('Failed to retrieve auth token');
            }

            const testCaseAttributeResponse = await client.graphql({
                query: getTestCaseFormData,
                variables: {projectID},
                authToken,
            });

            if (!testCaseAttributeResponse?.data?.getTestCaseFormData) {
                throw new Error('Test Case Attributes not found');
            }

            return testCaseAttributeResponse.data.getTestCaseFormData;
        } catch (error) {
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export const testCaseAttributeSlice = createSlice({
    name: 'testCaseAttribute',
    initialState,
    reducers: {
        clearTestCaseAttributeState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(doGetTestCaseAttribute.pending, (state) => {
                state.isTestCaseAttributeLoading = true;
            })
            .addCase(doGetTestCaseAttribute.fulfilled, async (state, action) => {
                state.isTestCaseAttributeLoading = false;
                state.isTestCaseAttributeError = false;
                console.log(action)
                const payload = await action.payload;

                state.testCaseStatuses = _.filter(payload?.attributes, {
                    type: 'STATUS'
                });
                state.testCasePriorities = _.filter(payload?.attributes, {
                    type: 'PRIORITY'
                });
                state.testCaseCategories = _.filter(payload?.attributes, {
                    type: 'CATEGORY'
                });
            })
            .addCase(doGetTestCaseAttribute.rejected, (state, action) => {
                state.isTestCaseAttributeLoading = false;
                state.isTestCaseAttributeError = true;
            });
    },
});

export const {clearTestCaseAttributeState} = testCaseAttributeSlice.actions;
export const selectIsTestCaseAttributeError = (state) => state?.testCaseAttribute?.isTestCaseAttributeError;
export const selectIsTestCaseAttributeLoading = (state) => state?.testCaseAttribute?.isTestCaseAttributeLoading;
export const selectTestCaseStatuses = (state) => state?.testCaseAttribute?.testCaseStatuses;
export const selectTestCasePriorities = (state) => state?.testCaseAttribute?.testCasePriorities;
export const selectTestCaseCategories = (state) => state?.testCaseAttribute?.testCaseCategories;

export default testCaseAttributeSlice.reducer;
