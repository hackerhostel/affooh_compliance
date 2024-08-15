import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {generateClient} from 'aws-amplify/api';
import {fetchAuthSession} from 'aws-amplify/auth';
import {getProjectUsers} from "../../graphql/projectQueries/queries.js";

const initialState = {
    isProjectUsersError: false,
    isProjectUsersLoading: false,
    projectUserList: [],
};

export const doGetProjectUsers = createAsyncThunk(
    'projectUsers/getProjectUsers',
    async (projectID, thunkApi) => {
        try {
            const client = generateClient();

            const session = await fetchAuthSession();
            const authToken = session?.tokens?.idToken;

            if (!authToken) {
                throw new Error('Failed to retrieve auth token');
            }

            const projectUsersResponse = await client.graphql({
                query: getProjectUsers,
                variables: {projectID},
                authToken,
            });

            if (!projectUsersResponse?.data?.listUsersByProject) {
                throw new Error('Project users not found');
            }

            console.log(projectUsersResponse.data.listUsersByProject)

            return projectUsersResponse.data.listUsersByProject;
        } catch (error) {
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export const projectUsersSlice = createSlice({
    name: 'projectUsers',
    initialState,
    reducers: {
        clearProjectUsersState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(doGetProjectUsers.pending, (state) => {
                state.isProjectUsersLoading = true;
            })
            .addCase(doGetProjectUsers.fulfilled, (state, action) => {
                state.projectUserList = action.payload;
                state.isProjectUsersLoading = false;
                state.isProjectUsersError = false;
            })
            .addCase(doGetProjectUsers.rejected, (state, action) => {
                state.isProjectUsersLoading = false;
                state.isProjectUsersError = true;
            });
    },
});

export const {clearProjectUsersState} = projectUsersSlice.actions;

export const selectIsProjectUsersError = (state) => state?.projectUsers?.isProjectUsersError;
export const selectIsProjectUsersLoading = (state) => state?.projectUsers?.isProjectUsersLoading;
export const selectProjectUserList = (state) => state?.projectUsers?.projectUserList;

export default projectUsersSlice.reducer;
