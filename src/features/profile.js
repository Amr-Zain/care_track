import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {  createApointment, getAppointmentsSlots, getProfileData, getClinics } from "../api/data";
import { addAppointment } from "./appointments";



const initialState = {
    profileData:{ 
        isLoading: false,
        error:''
    },
    clinic:{
        initShecheduleDate: null,
        appointmentTime: null,
        shecheduleDay:[],//
        id:null,
        clinicName:'',
        location:'',
        appointmentPeriod:0, //in minutes,
        isLoading: false, 
        error: ''
    },
    isLoading: false,
    success: '',
    error:''
}
export const getProfile = createAsyncThunk('profile/getProfile', 
    async ({ userType, id }, thunkAPI)=>{
    try {
        const result = await getProfileData({ userType, id });
        return(result)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const getDoctorClinics= createAsyncThunk('profile/getClinics',async(_,thunkAPI)=>{
    try{
        const clinics = await getClinics();
        return {clinics};
    }catch(error){
        return thunkAPI.rejectWithValue(error.value)
    }
})
export const getClinicAppointments = createAsyncThunk('profile/getClinicAppointments', 
    async ({ date, clinicId }, thunkAPI)=>{
    try {
        const shecheduleDay = await getAppointmentsSlots({ clinicId, date });
        return({ shecheduleDay })
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const bookAppointment = createAsyncThunk('profile/bookAppointment', 
    async ({ type, date,clinicId, doctorId, nurseId }, thunkAPI)=>{
    try {
        const app = await createApointment({ date, clinicId, doctorId, nurseId, type});
        thunkAPI.dispatch(addAppointment(app));
        return app
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
const profile = createSlice({
    name:'profile',
    initialState,
    reducers: {
        setClinicId:(state, { payload })=>{
            state.clinic.clinicId = payload.clinicId
        },
        setAppointmentTime: (state, { payload })=>{
            state.clinic.appointmentTime = payload.appointmentTime;
            state.error ='';
        },
        setInitShecheduleDate:( state, { payload })=>{
            state.clinic.initShecheduleDate = payload.initDate;
        },
        setError:(state,{ payload })=>{
            state.error = payload;
        },
        setClinic:(state,{ payload })=>{
            state.clinic = {appointmentTime:'',...payload.clinic
                ,shecheduleDay:[], isLoading: false, error:'',initShecheduleDate: new Date().setHours(9,0,0,0) }
        }

    },

    extraReducers:  (builder) => {
        builder
            .addCase(getProfile.pending, (state, action) => {
                state.profileData.isLoading = true;
                state.profileData.error ='';
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.profileData = action.payload;
                state.profileData.isLoading = false;
                state.profileData.error = '';
            })
            .addCase(getProfile.rejected, (state, { payload}) => {
                state.profileData.isLoading = false;
                state.profileData.error = payload;
            })
            .addCase(getClinicAppointments.pending, (state, action) => {
                state.clinic.isLoading = true;
                state.clinic.error ='';
                state.error ='';
            })
            .addCase(getClinicAppointments.fulfilled, (state, {payload}) => {
                state.clinic.shecheduleDay = payload.shecheduleDay;
                state.clinic.error ='';
                state.clinic.isLoading = false;
            })
            .addCase(getClinicAppointments.rejected, (state, { payload}) => {
                state.clinic.isLoading = false;
                state.clinic.error = payload;
            })
            .addCase(bookAppointment.fulfilled, ( state,{ payload })=>{
                state.isLoading = false;
                state.success = 'Appointment created successfully.'
                state.error = '';
            })
            .addCase(bookAppointment.pending, ( state,{ payload })=>{
                state.isLoading = true;
                state.error = '';
            })
            .addCase(bookAppointment.rejected, ( state,{ payload })=>{
                state.isLoading = false;
                state.error = payload;
            })
            .addCase(getDoctorClinics.fulfilled, ( state,{ payload })=>{
                state.profileData.clinics = payload.clinics;
            });
    },
});

export const { setClinicId, setInitShecheduleDate, setAppointmentTime, setError, setClinic } = profile.actions

export default profile.reducer;

