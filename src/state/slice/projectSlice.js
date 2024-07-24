import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {generateClient} from "aws-amplify/api";
import {fetchAuthSession} from "aws-amplify/auth";
import {getProjectBreakdown} from "../../graphql/organizationQueries/queries.js";

const initialState = {
  isProjectDetailsError: false,
  isProjectDetailsLoading: true,
  selectedProject: undefined,
  selectedProjectFromList: undefined,
  projectList: []
}

/**
 * @deprecated since version 2.0
 */
export const doGetProjectBreakdown = createAsyncThunk('src/project/getProjectBreakdown',
  async (_, thunkApi) => {
    try {
      const client = generateClient();

      const projectDetails = await client.graphql({
        query: getProjectBreakdown,
        authToken: (await fetchAuthSession())?.tokens?.idToken,
      });

      if (projectDetails) {
        return projectDetails.data.getProjectBreakdownV2
      } else {
        return thunkApi.rejectWithValue('project details not found');
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  });

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setSelectedProjectFromList: (state, action) => {
      state.selectedProjectFromList = action.payload;
    },
    clearProjectState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(doGetProjectBreakdown.pending, (state, action) => {
      state.isProjectDetailsLoading = true;
    });
    builder.addCase(doGetProjectBreakdown.fulfilled, (state, action) => {
      state.selectedProject = action.payload.defaultProject;
      state.projectList = action.payload.projects;
      state.isProjectDetailsLoading = false;
      state.isProjectDetailsError = false;
    });
    builder.addCase(doGetProjectBreakdown.rejected, (state, action) => {
      state.isProjectDetailsLoading = false;
      state.isProjectDetailsError = true;
    });
  }
})

export const {setSelectedProjectFromList} = projectSlice.actions;

export const selectIsProjectDetailsError = (state) => state.project.isProjectDetailsError;
export const selectIsProjectDetailsLoading = (state) => state.project.isProjectDetailsLoading;
export const selectSelectedProject = (state) => state.project.selectedProject;
export const selectSelectedProjectFromList = (state) => state.project.selectedProjectFromList;
export const selectProjectList = (state) => state.project.projectList;

export default projectSlice.reducer
