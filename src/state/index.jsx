import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slice/authSlice.js'
import projectReducer from './slice/projectSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer
  },
})