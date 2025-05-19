// Async Thunk for fetching release tasks
export const doGetReleaseTasks = createAsyncThunk(
  "release/getReleaseTasks",
  async (releaseId, thunkApi) => {
    try {
      const response = await axios.get(`/releases/${releaseId}/tasks`);
      const responseData = response.data.tasks;

      if (responseData) {
        return responseData;
      } else {
        return thunkApi.rejectWithValue("Tasks not found for this release");
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// Add state for release tasks
const initialState = {
  selectedRelease: undefined,
  isReleaseListForProjectError: false,
  isReleaseListForProjectLoading: false,
  releaseListForProject: [],
  checkListItems: [],
  releaseTasks: [], // New state for release tasks
  isReleaseTasksLoading: false,
  isReleaseTasksError: false,
};

// Add reducers and extraReducers
export const releaseSlice = createSlice({
  name: "release",
  initialState,
  reducers: {
    clearReleaseState: () => initialState,
    setSelectedRelease: (state, action) => {
      state.selectedRelease = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(doGetReleases.pending, (state) => {
        state.isReleaseListForProjectLoading = true;
      })
      .addCase(doGetReleases.fulfilled, (state, action) => {
        state.releaseListForProject = action.payload;
        const unreleased = action.payload.find(
          (release) => release.status === "UNRELEASED"
        );
        if (unreleased) {
          state.selectedRelease = unreleased;
        }
        state.isReleaseListForProjectLoading = false;
        state.isReleaseListForProjectError = false;
      })
      .addCase(doGetReleases.rejected, (state) => {
        state.isReleaseListForProjectLoading = false;
        state.isReleaseListForProjectError = true;
      })
      .addCase(doGetReleasesCheckListItems.pending, (state) => {
        state.isReleaseListForProjectLoading = true;
      })
      .addCase(doGetReleasesCheckListItems.fulfilled, (state, action) => {
        state.checkListItems = action.payload;
        state.isReleaseListForProjectLoading = false;
        state.isReleaseListForProjectError = false;
      })
      .addCase(doGetReleasesCheckListItems.rejected, (state) => {
        state.isReleaseListForProjectLoading = false;
        state.isReleaseListForProjectError = true;
      })
      // Add cases for release tasks
      .addCase(doGetReleaseTasks.pending, (state) => {
        state.isReleaseTasksLoading = true;
      })
      .addCase(doGetReleaseTasks.fulfilled, (state, action) => {
        state.releaseTasks = action.payload;
        state.isReleaseTasksLoading = false;
        state.isReleaseTasksError = false;
      })
      .addCase(doGetReleaseTasks.rejected, (state) => {
        state.isReleaseTasksLoading = false;
        state.isReleaseTasksError = true;
      });
  },
});

// Export selectors
export const selectReleaseTasks = (state) => state.release.releaseTasks;
export const selectIsReleaseTasksLoading = (state) =>
  state.release.isReleaseTasksLoading;
export const selectIsReleaseTasksError = (state) =>
  state.release.isReleaseTasksError;
