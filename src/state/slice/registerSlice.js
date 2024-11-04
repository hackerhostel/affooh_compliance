import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { post } from 'aws-amplify/api';
import { confirmSignUp } from 'aws-amplify/auth';
import axios from "axios";

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

export const fetchUserInvitedOrganization = createAsyncThunk(
    'register/fetchUserInvitedOrganization',
    async (email, thunkApi) => {
      try {
        const response = await axios.get(`/users/complete-registration/${email}`);

        if (!response?.data?.body?.name) {
          throw new Error('Invalid response format');
        }

        return response.data.body.name;

      } catch (error) {
        return thunkApi.rejectWithValue(
            error.message || 'Failed to send invitation'
        );
      }
    }
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

export const sendInvitation = createAsyncThunk(
    'invitations/sendInvitation',
    async ({ email, userRole }, thunkApi) => {
      try {
        const response = await axios.post('/organizations/invite-user', {
          email,
          userRole
        });

        if (!response?.data?.body?.userID) {
          throw new Error('Invalid response format');
        }

        return response.data.body.userID;

      } catch (error) {
        return thunkApi.rejectWithValue(
            error.message || 'Failed to send invitation'
        );
      }
    }
);

// Slice for managing invitations state
const invitationsSlice = createSlice({
  name: 'invitations',
  initialState: {
    invitations: [],
    currentInvitation: null
  },
  reducers: {
    clearInvitationError: (state) => {
      state.error = null;
    },
    resetInvitationStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.currentInvitation = null;
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(sendInvitation.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(sendInvitation.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.invitations.push(action.payload);
          state.currentInvitation = action.payload;
        })
        .addCase(sendInvitation.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
  }
});

export const { clearRegisterState } = registerSlice.actions;
export const selectRegisterState = (state) => state.register;

export default registerSlice.reducer;
