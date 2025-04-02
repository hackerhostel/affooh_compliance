import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Auth } from "aws-amplify"; // AWS Amplify එකෙන් token එක ගන්න

const initialState = {
  isTestPlanListForProjectError: false,
  isTestPlanListForProjectLoading: false,
  testPlanListForProject: [],
  selectedTestPlanId: 0,
  selectedTestPlan: {},
  // Issue Count State
  isIssueCountLoading: false,
  isIssueCountError: false,
  issueCount: 0,
  // Issues List State
  isIssuesLoading: false,
  isIssuesError: false,
  issues: [],
  // Add Issues State
  isAddIssuesLoading: false,
  isAddIssuesError: false,
};

// Fetch Test Plans for a Project
export const doGetTestPlans = createAsyncThunk(
  "testPlans/getTestPlans",
  async (projectId, thunkApi) => {
    try {
      const response = await axios.get(`/projects/${projectId}/test-plans`);
      const responseData = response.data.body;

      if (responseData) {
        return responseData;
      } else {
        return thunkApi.rejectWithValue("Test plans not found");
      }
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// Fetch Issue Count for a Test Suite
export const doGetIssueCount = createAsyncThunk(
  "testPlans/getIssueCount",
  async ({ testSuiteId }, thunkApi) => {
    try {
      const token = (await Auth.currentSession()).getIdToken().getJwtToken(); // Token එක ගන්න
      const response = await axios.get(
        `/test-plans/test-suites/${testSuiteId}/issues/count`,
        {
          params: { email },
          headers: {
            Authorization: `Bearer ${token}`, // Token එක add කරනවා
          },
        }
      );
      const responseData = response.data.body;

      if (responseData !== undefined) {
        return responseData;
      } else {
        return thunkApi.rejectWithValue("Issue count not found");
      }
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// Fetch Issues for a Test Suite
export const doGetIssues = createAsyncThunk(
  "testPlans/getIssues",
  async ({ testSuiteId }, thunkApi) => {
    try {
      const token = (await Auth.currentSession()).getIdToken().getJwtToken(); // Token එක ගන්න
      const response = await axios.get(
        `/test-plans/test-suites/${testSuiteId}/issues`,
        {
          params: { email },
          headers: {
            Authorization: `Bearer ${token}`, // Token එක add කරනවා
          },
        }
      );
      const responseData = response.data.body;

      if (responseData) {
        return responseData;
      } else {
        return thunkApi.rejectWithValue("Issues not found");
      }
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// Add Issues to a Test Suite
export const doAddIssues = createAsyncThunk(
  "testPlans/addIssues",
  async ({ testSuiteId, taskIDs }, thunkApi) => {
    try {
      const token = (await Auth.currentSession()).getIdToken().getJwtToken(); // Token එක ගන්න
      const response = await axios.post(
        `/test-plans/test-suites/${testSuiteId}/issues`, // URL එක fix කරනවා
        {
          testSuiteId,
          taskIDs,
          createdByEmail: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token එක add කරනවා
          },
        }
      );
      console.log("API Response:", response);
      const responseData = response.data.body;
      if (response.data.error || !responseData) {
        return thunkApi.rejectWithValue(
          response.data.message || "Failed to add issues"
        );
      }
      return responseData;
    } catch (error) {
      console.error("Error adding issues:", error);
      return thunkApi.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const testPlansSlice = createSlice({
  name: "testPlans",
  initialState,
  reducers: {
    setSelectedTestPlanId: (state, action) => {
      state.selectedTestPlanId = action.payload;
    },
    setSelectedTestPlan: (state, action) => {
      state.selectedTestPlan = action.payload;
    },
    clearTestPlanState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Test Plans
      .addCase(doGetTestPlans.pending, (state) => {
        state.isTestPlanListForProjectLoading = true;
      })
      .addCase(doGetTestPlans.fulfilled, (state, action) => {
        state.testPlanListForProject = action.payload;

        const inProgress = action.payload.find(
          (testPlan) => testPlan.status === "IN PROGRESS"
        );
        if (inProgress) {
          state.selectedTestPlanId = inProgress.id;
        }

        state.isTestPlanListForProjectLoading = false;
        state.isTestPlanListForProjectError = false;
      })
      .addCase(doGetTestPlans.rejected, (state, action) => {
        state.isTestPlanListForProjectLoading = false;
        state.isTestPlanListForProjectError = true;
      })
      // Get Issue Count
      .addCase(doGetIssueCount.pending, (state) => {
        state.isIssueCountLoading = true;
      })
      .addCase(doGetIssueCount.fulfilled, (state, action) => {
        state.issueCount = action.payload;
        state.isIssueCountLoading = false;
        state.isIssueCountError = false;
      })
      .addCase(doGetIssueCount.rejected, (state, action) => {
        state.isIssueCountLoading = false;
        state.isIssueCountError = true;
      })
      // Get Issues
      .addCase(doGetIssues.pending, (state) => {
        state.isIssuesLoading = true;
      })
      .addCase(doGetIssues.fulfilled, (state, action) => {
        state.issues = action.payload;
        state.isIssuesLoading = false;
        state.isIssuesError = false;
      })
      .addCase(doGetIssues.rejected, (state, action) => {
        state.isIssuesLoading = false;
        state.isIssuesError = true;
      })
      // Add Issues
      .addCase(doAddIssues.pending, (state) => {
        state.isAddIssuesLoading = true;
      })
      .addCase(doAddIssues.fulfilled, (state, action) => {
        state.isAddIssuesLoading = false;
        state.isAddIssuesError = false;
      })
      .addCase(doAddIssues.rejected, (state, action) => {
        state.isAddIssuesLoading = false;
        state.isAddIssuesError = true;
      });
  },
});

export const {
  clearTestPlanState,
  setSelectedTestPlanId,
  setSelectedTestPlan,
} = testPlansSlice.actions;

// Selectors
export const selectIsTestPlanListForProjectError = (state) =>
  state?.testPlans?.isTestPlanListForProjectError;
export const selectIsTestPlanListForProjectLoading = (state) =>
  state?.testPlans?.isTestPlanListForProjectLoading;
export const selectTestPlanListForProject = (state) =>
  state?.testPlans?.testPlanListForProject;
export const selectSelectedTestPlanId = (state) =>
  state.testPlans?.selectedTestPlanId;
export const selectSelectedTestPlan = (state) =>
  state.testPlans?.selectedTestPlan;
export const selectIssueCount = (state) => state.testPlans?.issueCount;
export const selectIsIssueCountLoading = (state) =>
  state.testPlans?.isIssueCountLoading;
export const selectIsIssueCountError = (state) =>
  state.testPlans?.isIssueCountError;
export const selectIssues = (state) => state.testPlans?.issues;
export const selectIsIssuesLoading = (state) =>
  state.testPlans?.isIssuesLoading;
export const selectIsIssuesError = (state) => state.testPlans?.isIssuesError;
export const selectIsAddIssuesLoading = (state) =>
  state.testPlans?.isAddIssuesLoading;
export const selectIsAddIssuesError = (state) =>
  state.testPlans?.isAddIssuesError;

export default testPlansSlice.reducer;
