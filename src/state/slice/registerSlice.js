import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {post} from 'aws-amplify/api';  // Updated import
import {signUp} from 'aws-amplify/auth';
import axios from "axios";

const initialState = {
    user: null,
    loading: false,
    error: null,
};

export const doRegisterUser = createAsyncThunk(
    'register/doRegisterUser',
    async (userDetails, thunkApi) => {
        const {organization, firstName, lastName, username, password} = userDetails;
        try {
            console.log('Attempting to register user with details:', userDetails);

            // TODO: The signup worked fine in Amplify
            // const { isSignUpComplete, userId, nextStep } = await signUp({
            //   username,
            //   password,
            //   options: {
            //     userAttributes: {
            //       username
            //     }
            //   }
            // });

            // console.log(isSignUpComplete, userId, nextStep);

            // const response = await axios.post(`/users/register-user`, {
            //     body: {
            //         user: {
            //             password,
            //             username,
            //             firstName,
            //             lastName,
            //             organizationName: organization,
            //         }
            //     }
            // })
            // const responseData = response.data.body;
            //
            // if (responseData) {
            //     console.error(responseData)
            //     return responseData
            // } else {
            //     return thunkApi.rejectWithValue('Error while registering user');
            // }

            // const restOperation = post({
            //     apiName: 'afooh-prod-public-api',
            //     path: '/register-user',
            //     options: {
            //         body: {
            //             message: userDetails
            //         }
            //     }
            // });
            //
            // const { body } = await restOperation.response;
            // const response = await body.json();

            const response = await post({
                apiName:'afooh-prod-public-api', path: '/register-user', options: {
                    headers: {
                        Authorization: 'test'
                    },
                body: {
                    user: {
                        password,
                            username,
                            firstName,
                            lastName,
                            organizationName: organization,
                    },
                }
            }
            });

            if (response) {
                console.error('Registration successful:', response);
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

export const {clearRegisterState} = registerSlice.actions;
export const selectRegisterState = (state) => state.register;

export default registerSlice.reducer;