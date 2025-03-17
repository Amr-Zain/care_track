import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { listAppointments, deleteUserAppointment, UpdateAppointment  } from "../api/data";
import {  } from 'react-icons/md'

const initialState = {
    date: new Date().getTime(),
    appointments: [],
    todayApps:[], //for doctors and nurse
    totalPatients:0,
    isLoading: false,
    error:'',
    appointmentUpdateLoading:false,
    appointmentUpdateError:''
}
export const getAppointments = createAsyncThunk('appointments/getAppointments', 
    async ({date}, thunkAPI)=>{
    try {
        const { userType } = thunkAPI.getState().authedUser.user;
        const result = await listAppointments({ userType, date: new Date(date).getTime() });
        return { appointments: result }
    } catch (error) {
        console.error(error)
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const getTodayAppointments = createAsyncThunk('appointments/getTodayAppointments', 
    async (_, thunkAPI)=>{
    try {
        const { userType } = thunkAPI.getState().authedUser.user;
        const result = await listAppointments({ userType, date: new Date().getTime() });
        return { appointments: result }
    } catch (error) {
        console.error(error)
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const updateAppointment = createAsyncThunk('appointments/updateAppointment',
    async({ id, date },thunkAPI)=>{
        try {
            await UpdateAppointment({id, date});
            return { date: new Date(date).getTime(), id };
        }catch(error){
            return thunkAPI.rejectWithValue(error.message);
        }
    });
export const cancelAppointment = createAsyncThunk('appointments/cancelAppointment',
    async({ id } ,thunkAPI)=>{
        try {
            await deleteUserAppointment({id});
        return thunkAPI.dispatch(deleteAppointment({ appointmentId: id}))
        }catch(error){
            return thunkAPI.rejectWithValue(error.message);
        }
    });
const appointmentsSlice = createSlice({
    name:'appointments',
    initialState,
    reducers: {
        addAppointment: (state, { payload })=>{
            state.appointments.push(payload);
        },
        deleteAppointment: (state, { payload })=>{
            state.appointments = state.appointments.filter(app=>app.id !== payload.appointmentId);
        },
        updateAppointmentDate: (state, { payload })=>{
            state.appointments = state.appointments.map((appointment)=>{
                    if (appointment.id === payload.id){
                        return { ...appointment, appointmentDate: new Date(payload.date).getTime() };
                    }else{
                        return appointment;
                    }
            })
        },
        setDate: (state,{payload})=>{
            state.date = payload.date;
        },setTotalPatients: (state, action) => {
            state.totalPatients = action.payload;
        }
    },
    extraReducers:  (builder) => {
        builder
            .addCase(getAppointments.fulfilled, (state, { payload }) => {
                state.appointments = payload.appointments;
                state.isLoading = false;
            })
            .addCase(getAppointments.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getAppointments.rejected, (state, { payload}) => {
                state.isLoading = false;
                state.error = payload;
            })
            .addCase(getTodayAppointments.fulfilled, (state, { payload }) => {
                state.todayApps = payload.appointments;
                state.isLoading = false;
            })
            .addCase(getTodayAppointments.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getTodayAppointments.rejected, (state, { payload}) => {
                state.isLoading = false;
                state.error = payload;
            })
            .addCase(updateAppointment.pending, (state, action) => {
                state.appointmentUpdateLoading = true;
            })
            .addCase(updateAppointment.rejected, (state, { payload}) => {
                state.appointmentUpdateLoading = false;
                state.appointmentUpdateError = payload;
            })
            .addCase(updateAppointment.fulfilled,(state, { payload })=>{
                const index = state.appointments.findIndex(app=>app.id === payload.id);
                state.appointments[index].date = payload.date;
                state.appointmentUpdateLoading = false;

            })
            .addCase(cancelAppointment.fulfilled,(state, { payload })=>{
                state.appointments = state.appointments.filter( app => app.id !== payload.id);
                state.appointmentUpdateLoading = false;
                state.appointmentUpdateError = '';
            }).addCase(cancelAppointment.pending, (state, action) => {
                state.appointmentUpdateLoading = true;
                state.appointmentUpdateError = '';
            })
            .addCase(cancelAppointment.rejected, (state, { payload}) => {
                state.appointmentUpdateLoading = false;
                state.appointmentUpdateError = payload;
            })
    },
});
export const { addAppointment, deleteAppointment, updateAppointmentDate, setDate, setTotalPatients } = appointmentsSlice.actions;

export default appointmentsSlice.reducer;

