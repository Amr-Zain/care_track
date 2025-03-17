import { createSlice, nanoid } from "@reduxjs/toolkit";
import { createDiagnosis } from "./medicalHistory";

const initialState = { 
  description: '', 
  error: '', 
  isLoading: false,
  successed: '',
  medicines: [{ 
    id: nanoid(12), 
    name: '', 
    dose: '', 
    duration: '', 
    description: '' 
  }]
};

const diagnosisFormSlice = createSlice({
  name: 'diagnosisForm',
  initialState,
  reducers: {
    addFormMedicine: (state) => {
      state.medicines.push({ id: nanoid(12), name: '', dose: '', duration: '' });
    },
    deleteFormMedicine: (state, { payload }) => {
      state.medicines = state.medicines.filter(med => med.id !== payload.id);
    },
    setFromDescription: (state, { payload }) => {
      state.description = payload;
    },
    setFormMedicine: (state, { payload }) => {
      const index = state.medicines.findIndex(med => med.id === payload.id);
      state.medicines[index][payload.name] = payload.value;
    },
    setFormError: (state, { payload }) => {
      state.error = payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDiagnosis.pending, (state) => {
        state.isLoading = true;
        state.error = '';
        state.successed = '';
      })
      .addCase(createDiagnosis.fulfilled, (state) => {
        state.isLoading = false;
        state.successed = 'Diagnosis Created Successfully';
      })
      .addCase(createDiagnosis.rejected, (state, action) => {
        state.isLoading = false;
        state.successed = '';
        state.error = action.payload;
      });
  }
});

export const { 
  addFormMedicine, 
  deleteFormMedicine, 
  setFromDescription, 
  setFormMedicine,
  setFormError
} = diagnosisFormSlice.actions;

export default diagnosisFormSlice.reducer;