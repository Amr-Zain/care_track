import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPatient } from "../api/data";

const initialState = {
  data: {
    id: '',
    image: '',
    name: '',
    age: 0,
    isLoading: false,
  },
  isLoading: false,
  error: ''
};

export const getPatientInfo = createAsyncThunk(
  'patient/getPatientInfo',
  async ({ patientId }, thunkAPI) => {
    try {
      const data = await getPatient({ patientId });
      return { data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getPatientInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPatientInfo.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getPatientInfo.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  }
});

export default patientSlice.reducer;