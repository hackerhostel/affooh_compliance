import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice.js';
import projectReducer from './slice/projectSlice.js';
import registerReducer from './slice/registerSlice.js';
import testPlanReducer from "./slice/testPlanSlice.js";
import sprintReducer from './slice/sprintSlice.js'
import testCaseAttributeReducer from "./slice/testCaseAttributeSlice.js";
import projectUsersReducer from "./slice/projectUsersSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    register: registerReducer,
    sprint: sprintReducer,
    testPlan: testPlanReducer,
    testCaseAttribute: testCaseAttributeReducer,
    projectUsers : projectUsersReducer
  },
});
