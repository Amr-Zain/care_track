import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUser, createUserSession, getUser } from "../api/data";

const initialState = {
    user:  JSON.parse(localStorage.getItem('user')) || {},
    error:'',
    isLoading:false,
}
export const setAuthedUserThunk = createAsyncThunk('authedUser/setAuthedUser', 
    async ({ create, user}, thunkAPI)=>{
    try {
        const fun = create? createUser: createUserSession;
        const data = await fun(user);
        return {user: data};
    } catch (error) {
        setError({error: error.message})
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const getUserData = createAsyncThunk('authedUser/getUserData', 
    async ({ token, refreshToken }, thunkAPI)=>{
    try {
        let data = await getUser();
        return {user: data}
    } catch (error) {
        setError({error: error.message})
        return thunkAPI.rejectWithValue(error.message);
    }
});
const authedUserSlice = createSlice({
    name:'authedUser',
    initialState,
    reducers: {
        removeAuthedUser:(state,action)=>{
            state.user = {};
        },
        setError: (state, { payload}) =>{
            const { error } = payload;
            return { ...state, error}
        },
        setImage: (state,{ payload }) =>{
            state.user.imageURL = payload.url;
        }
    },
    extraReducers:  (builder) => {
        builder
            .addCase(setAuthedUserThunk.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(setAuthedUserThunk.fulfilled, (state, { payload }) => {
                state.user = payload.user;
                state.isLoading = false;
                //state = { ...payload, isLoading: false, error:''}
            })
            .addCase(setAuthedUserThunk.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload;
            })
            .addCase(getUserData.fulfilled, (state, { payload }) => {
                state.user = payload?.user||{};
                state.isLoading = false;
                //state = { ...payload, isLoading: false, error:''}
            })
    },
});

export const { setAuthedUser, removeAuthedUser, setImage, updateTokens, setError } = authedUserSlice.actions;

export default authedUserSlice.reducer;