import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    customFields: [],
    loading: false,
    error: null,
};

// Create a custom field
export const createCustomField = createAsyncThunk(
    "customField/create",
    async (customFieldData, { rejectWithValue }) => {
        try {
            const response = await axios.post("/custom-fields", customFieldData);
            return response.data.body;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// Fetch all custom fields
export const fetchCustomFields = createAsyncThunk(
    "customField/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/custom-fields");
            return response.data.body;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// Delete a custom field
export const deleteCustomField = createAsyncThunk(
    "customField/delete",
    async (customFieldId, { rejectWithValue }) => {
        try {
            await axios.delete(`/custom-fields/${customFieldId}`);
            return customFieldId;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const customFieldSlice = createSlice({
    name: "customField",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createCustomField.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCustomField.fulfilled, (state, action) => {
                state.loading = false;
                state.customFields.push(action.payload);
            })
            .addCase(createCustomField.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch All
            .addCase(fetchCustomFields.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomFields.fulfilled, (state, action) => {
                state.loading = false;
                state.customFields = action.payload;
            })
            .addCase(fetchCustomFields.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteCustomField.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCustomField.fulfilled, (state, action) => {
                state.loading = false;
                state.customFields = state.customFields.filter(
                    (field) => field.id !== action.payload
                );
            })
            .addCase(deleteCustomField.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default customFieldSlice.reducer;
