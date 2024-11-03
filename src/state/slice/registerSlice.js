import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { post } from 'aws-amplify/api';
import { confirmSignUp } from 'aws-amplify/auth';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const doRegisterUser = createAsyncThunk(
  'register/doRegisterUser',
  async (userDetails, thunkApi) => {
    const { organization, firstName, lastName, username, password } =
      userDetails;
    try {
      const response = await post({
        apiName: 'AffoohAPI',
        path: '/users/register-user',
        options: {
          body: {
            user: {
              password,
              email: username,
              firstName,
              lastName,
              organizationName: organization,
            },
          },
          headers: {
            // TODO: hardcoded as a sample. move to a proper config.
            'X-Api-Key': 'MKEutNn1JZ5l411hLitRu8KLq7Ih8Qh6611OtBR3',
          },
        },
      });

      if (response) {
        return response.resolve();
      } else {
        return thunkApi.rejectWithValue('Registration failed');
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  },
);

export const doVerifyOTP = createAsyncThunk(
    'register/doVerifyOTP',
    async (verificationDetails, thunkApi) => {
      const { username, otp } = verificationDetails;

      try {
        const verificationResult = await confirmSignUp({
          username,
          confirmationCode: otp
        });

        if (!verificationResult.isSignUpComplete) {
          return thunkApi.rejectWithValue('OTP verification failed');
        }
      } catch (error) {
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
