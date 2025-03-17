import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getDiagnosisPref, 
  getDiagnosisById, 
  getPatientMedicines, 
  getPatientDiagnosisCategoy,
  listDiagnosisMedicines,
  postDiagnosis
} from "../api/data";

const initialState = {
  filters: { selectedCategories: [], date: '0', byDoctor: false },
  medicines: { data: [], error: '', isLoading: false },
  diagnosis: { data: [], patientDiagnosisCategories: [], error: '', isLoading: false }
};


export const getDiagnosis = createAsyncThunk(
  'medicalHistory/getDiagnosis',
  async ({ type, patientId, diagnosisId }, thunkAPI) => {
    try {
      if(type === 'categories') {
        return await getPatientDiagnosisCategoy({ patientId });
      }
      if(type === 'diagnosis') {
        
        return await getDiagnosisById({ patientId, id: diagnosisId });
      }
      const { filters } = thunkAPI.getState().medicalHistory;
      return await getDiagnosisPref({ ...filters, patientId });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getMedicines = createAsyncThunk(
  'medicalHistory/getMedicines',
  async ({ patientId }, thunkAPI) => {
    try {
      return await getPatientMedicines(patientId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getDiagnosisMedicines = createAsyncThunk(
  'medicalHistory/getDiagnosisMedicines',
  async ({ patientId, diagnosisId }, thunkAPI) => {
    try {
      return await listDiagnosisMedicines({ patientId, diagnosisId });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createDiagnosis = createAsyncThunk(
    'medicalHistory/createDiagnosis',
    async ({ description, medicines, patientId }, thunkAPI) => {
      try {
        const clinicId = thunkAPI.getState().appointments.appointments.find(app=>app.patientId === patientId)?.clinicId || null;
        await postDiagnosis({ description, medicines, patientId, clinicId });
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
const medicalHistorySlice = createSlice({
  name: 'medicalHistory',
  initialState,
  reducers: {
    changeFilterCategory: (state, { payload }) => {
      state.filters.selectedCategories = payload.categories;
    },
    setFilterByDoctor: (state, { payload }) => {
      state.filters.byDoctor = payload.byDoctor;
    },
    setFilterDate: (state, { payload }) => {
      state.filters.date = payload.date;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDiagnosis.pending, (state, action) => {
        if(action.meta.arg.type !== "categories") {
          state.diagnosis.isLoading = true;
        }
        state.diagnosis.error = '';
      })
      .addCase(getDiagnosis.fulfilled, (state, action) => {
        if(action.meta.arg.type === 'categories') {
          state.diagnosis.patientDiagnosisCategories = action.payload;
        } else {
          if(action.meta.arg.type === 'diagnosis') {
            const exists = state.diagnosis.data.some(d => d.id === action.payload.id);
            if(!exists) state.diagnosis.data.push(action.payload);
          } else {
            state.diagnosis.data = action.payload;
          }
        }
        state.diagnosis.isLoading = false;
      })
      .addCase(getDiagnosis.rejected, (state, action) => {
        state.diagnosis.isLoading = false;
        state.diagnosis.error = action.payload;
      })
      .addCase(getMedicines.pending, (state) => {
        state.medicines.isLoading = true;
        state.medicines.error = '';
      })
      .addCase(getMedicines.fulfilled, (state, action) => {
        state.medicines.data = action.payload;
        state.medicines.isLoading = false;
      })
      .addCase(getMedicines.rejected, (state, action) => {
        state.medicines.isLoading = false;
        state.medicines.error = action.payload;
      })
      .addCase(getDiagnosisMedicines.fulfilled, (state, action) => {
        const diagnosisId = action.meta.arg.diagnosisId;
        const index = state.diagnosis.data.findIndex(d => d.id === diagnosisId);
        if(index !== -1) {
          state.diagnosis.data[index].medicines = action.payload;
        }
      });
  }
});

export const { changeFilterCategory, setFilterByDoctor, setFilterDate } = medicalHistorySlice.actions;
export const selectDiagnosisById = diagnosisId => state => 
  state.medicalHistory.diagnosis.data.find(d => d?.id === diagnosisId);

export default medicalHistorySlice.reducer;