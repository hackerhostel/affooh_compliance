import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {generateClient} from "aws-amplify/api";
import {fetchAuthSession} from "aws-amplify/auth";
import {getDetailsForDashboard} from "../../graphql/userQueries/queries.js";

const initialState = {
  appConfig: {},
  user: {permissions: []},
}

/**
 * @deprecated since version 2.0
 */
export const doGetCurrentUser = createAsyncThunk('src/auth/getCurrentUser', async (_, thunkApi) => {
  try {
    const client = generateClient();

    const userDetails = await client.graphql({
      query: getDetailsForDashboard,
      authToken: (await fetchAuthSession())?.tokens?.idToken,
    });

    if (userDetails) {
      // TODO: handle data
      return userDetails.data.getDetailsForDashboard
    } else {
      return thunkApi.rejectWithValue('User details not found');
    }
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(doGetCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  }
})

export const {clearAuthState} = authSlice.actions

export const selectUser = (state) => state.auth.user;

export default authSlice.reducer