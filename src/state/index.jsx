import registerReducer from './slice/registerSlice.js';
import {configureStore} from '@reduxjs/toolkit'
import appReducer from './slice/appSlice.js'
import authReducer from './slice/authSlice.js'
import projectReducer from './slice/projectSlice.js'
import testPlansReducer from "./slice/testPlansSlice.js";
import sprintReducer from './slice/sprintSlice.js'
import testCaseFormDataReducer from "./slice/testCaseFormDataSlice.js";
import projectUsersReducer from "./slice/projectUsersSlice.js";
import releaseReducer from "./slice/releaseSlice.js";
import platformReducer from "./slice/platformSlice.js";
import testCaseReducer from "./slice/testCaseSlice.js";
import settingReducer from "./slice/settingSlice.js"
import customFieldReducer from "./slice/customFieldSlice.js"
import testIssueReducer from "./slice/testIssueSlice.js";
import screenReducer from "./slice/screenSlice.js";
import taskTypeReducer from "./slice/taskTypeSlice.js";
import assetReducer from "./slice/assetSlice.js";
import cloudAssetReducer from "./slice/cloudAssetSlice.js";
import deviceDisposalReducer from "./slice/deviceDisposalSlice.js";
import deviceMovementReducer from "./slice/deviceMovementSlice.js";

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    project: projectReducer,
    register: registerReducer,
    sprint: sprintReducer,
    testPlans: testPlansReducer,
    testCaseFormData: testCaseFormDataReducer,
    projectUsers: projectUsersReducer,
    release: releaseReducer,
    platform: platformReducer,
    testCase: testCaseReducer,
    setting: settingReducer,
    customField: customFieldReducer,
    testIssue: testIssueReducer,
    screen: screenReducer,
    taskType: taskTypeReducer,
    asset: assetReducer,
    cloudAsset: cloudAssetReducer,
    deviceDisposal: deviceDisposalReducer,
    deviceMovement: deviceMovementReducer
  }
});
