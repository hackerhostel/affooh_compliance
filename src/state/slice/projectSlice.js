import {createSlice} from "@reduxjs/toolkit";
import {authSlice} from "./authSlice.js";

const initialState = {
  selectedProject: undefined,
  projectList: []
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearProjectState: () => initialState,
  },
  extraReducers: (builder) => {
  }
})

export const {setSelectedProject} = projectSlice.actions;

export const selectSelectedProject = (state) => state.project.selectedProject;

export default projectSlice.reducer
