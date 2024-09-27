import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as Amplify from 'aws-amplify';  // Updated import

const API = Amplify.API;

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const doRegisterUser = createAsyncThunk(
  'register/doRegisterUser',
  async (userDetails, thunkApi) => {
    const { organization, firstName, lastName, email, password } = userDetails;
    try {
      console.log('Attempting to register user with details:', userDetails);
      const response = await API.post('afooh-prod-public-api', 'register-user', {
        body: {
          user: {
            password,
            email,
            firstName,
            lastName,
            organizationName: organization,
          },
        },
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
          'x-api-key': 'i96NvXChBqwJbv1973ti8196S9jnvMr9J1z2Yteg',
        },
      });

      if (response) {
        console.log('Registration successful:', response);
        return response;
      } else {
        console.error('Registration failed: No response');
        return thunkApi.rejectWithValue('Registration failed');
      }
    } catch (error) {
      console.error('Registration failed with error:', error.message);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    clearRegisterState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(doRegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doRegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(doRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRegisterState } = registerSlice.actions;
export const selectRegisterState = (state) => state.register;

export default registerSlice.reducer;