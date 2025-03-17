import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { listPopuler } from "../api/data";

const initialState = {
    doctors: [],
    nurses: [],
    isLoading: false,
    error:''
}
export const getPopulars = createAsyncThunk('populars/getPopulars', 
    async (_, thunkAPI)=>{
    try {
        if(thunkAPI.getState().populars.doctors.length === 0 ){
            const [ doctors, nurses ] = await Promise.all([ listPopuler({ type:'doctor'}), listPopuler({ type: 'nurse'}) ]);
            console.log({doctors,nurses})
            return { doctors, nurses } 
        }
        return {};
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
const populars = createSlice({
    name:'populars',
    initialState,
    reducers: {},

    extraReducers:  (builder) => {
        builder
            .addCase(getPopulars.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getPopulars.fulfilled, (state, action) => {
                if(action.payload.doctors) {
                    console.log( action.payload.doctors)
                    state.doctors = action.payload.doctors
                    state.nurses = action.payload.nurses
                }
                state.isLoading = false;
            })
            .addCase(getPopulars.rejected, (state, { payload}) => {
                state.isLoading = false;
                state.error = payload;
            });
    },
});


export default populars.reducer;

