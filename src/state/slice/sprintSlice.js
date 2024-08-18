import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {generateClient} from "aws-amplify/api";
import {fetchAuthSession} from "aws-amplify/auth";
import {listSprintsByProject} from "../../graphql/sprintQueries/queries.js";

const initialState = {
  selectedSprint: undefined,
  sprintListForProject: [],
  isSprintListForProjectLoading: false,
  isSprintListForProjectError: false
}

export const doGetSprintBreakdown = createAsyncThunk('src/sprint/getSprintBreakdown',
  async (projectId, thunkApi) => {
    try {
      const client = generateClient();

      const sprintListResponse = await client.graphql({
        query: listSprintsByProject,
        variables: {projectID: projectId},
        authToken: (await fetchAuthSession())?.tokens?.idToken,
      });

      if (sprintListResponse) {
        return sprintListResponse.data.listSprintsByProject
      } else {
        return thunkApi.rejectWithValue('sprint list not found');
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  });

export const sprintSlice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    setSelectedSprint: (state, action) => {
      state.selectedSprint = action.payload;
    },
    clearSprintState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(doGetSprintBreakdown.pending, (state, action) => {
      state.isSprintListForProjectLoading = true;
    });
    builder.addCase(doGetSprintBreakdown.fulfilled, (state, action) => {
      state.sprintListForProject = action.payload;
      state.selectedSprint = action.payload[0];
      state.isSprintListForProjectLoading = false;
      state.isSprintListForProjectError = false;
    });
    builder.addCase(doGetSprintBreakdown.rejected, (state, action) => {
      state.isSprintListForProjectLoading = false;
      state.isSprintListForProjectError = true;
    });
  }
})

export const {setSelectedSprintFromList, setSelectedSprint} = sprintSlice.actions;

export const selectSelectedSprint = (state) => state.sprint.selectedSprint;
export const selectIsSprintListForProjectError = (state) => state.sprint.isSprintListForProjectError;
export const selectIsSprintListForProjectLoading = (state) => state.sprint.isSprintListForProjectLoading;
export const selectSprintListForProject = (state) => state.sprint.sprintListForProject;

export default sprintSlice.reducer
