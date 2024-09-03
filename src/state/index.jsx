import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice.js';
import projectReducer from './slice/projectSlice.js';
import registerReducer from './slice/registerSlice.js';
import testPlansReducer from "./slice/testPlansSlice.js";
import sprintReducer from './slice/sprintSlice.js'
import testCaseFormDataReducer from "./slice/testCaseFormDataSlice.js";
import projectUsersReducer from "./slice/projectUsersSlice.js";
import releaseReducer from "./slice/releaseSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    register: registerReducer,
    sprint: sprintReducer,
    testPlans: testPlansReducer,
    testCaseFormData: testCaseFormDataReducer,
    projectUsers: projectUsersReducer,
    release: releaseReducer
  },
});
