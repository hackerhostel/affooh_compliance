import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {doGetSprintBreakdown, doGetSprintFormData, setRedirectSprint} from "./sprintSlice.js";
import {doGetProjectUsers} from "./projectUsersSlice.js";

const initialState = {
  isProjectDetailsError: false,
  isProjectDetailsLoading: true,
  selectedProject: undefined,
  selectedProjectFromList: undefined,
  projectList: [],

  isSwitchingProject: true
}

export const doGetProjectBreakdown = createAsyncThunk('src/project/getProjectBreakdown',
  async (_, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const { selectedProject } = state.project;

      if (selectedProject) {
        const selectedProjectId = selectedProject?.id
        thunkApi.dispatch(setRedirectSprint(0));
        thunkApi.dispatch(doGetSprintBreakdown(selectedProjectId));
        thunkApi.dispatch(doGetProjectUsers(selectedProjectId));
        thunkApi.dispatch(doGetSprintFormData());
      } else {
        return thunkApi.rejectWithValue('project details not found');
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  });

export const doSwitchProject = createAsyncThunk('src/project/switchProject',
  async (newProjectId, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const { projectList } = state.project;

      // TODO: other initial lists will be invoked here
      thunkApi.dispatch(setRedirectSprint(0));
      thunkApi.dispatch(doGetSprintBreakdown(newProjectId));
      thunkApi.dispatch(doGetProjectUsers(newProjectId));
      thunkApi.dispatch(doGetSprintFormData());

      if(projectList && Array.isArray(projectList)) {
        const pp = projectList.filter(p => p.id === newProjectId)
        return pp[0]
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
    setProjectList: (state, action) => {
      state.projectList = action.payload;
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearProjectState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(doSwitchProject.pending, (state, action) => {
      state.isSwitchingProject = true;
    });
    builder.addCase(doSwitchProject.fulfilled, (state, action) => {
      state.selectedProject = action.payload;
      state.isSwitchingProject = false;
    });
  }
})

export const {setSelectedProjectFromList, setProjectList, setSelectedProject} = projectSlice.actions;

export const selectIsProjectDetailsError = (state) => state.project.isProjectDetailsError;
export const selectIsProjectDetailsLoading = (state) => state.project.isProjectDetailsLoading;
export const selectSelectedProject = (state) => state.project.selectedProject;
export const selectSelectedProjectFromList = (state) => state.project.selectedProjectFromList;
export const selectProjectList = (state) => state.project.projectList;

export default projectSlice.reducer
