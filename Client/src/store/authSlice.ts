import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
    id: number,
    name: string,
    email: string,
    role: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null    
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true
            state.error = null
        },
        isloading(state,action: PayloadAction<boolean>){
            state.loading = action.payload
        },
        loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
            state.loading = false
            state.error = null
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.loading = true
            state.error = action.payload
        },
        logout(state) {
            sessionStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        updateUserRole(state, action: PayloadAction<string>) {
            if (state.user) {
                state.user.role = action.payload; // update only the role
            }
        }
    }
})


export const { loginStart, loginSuccess, loginFailure, logout,updateUserRole,isloading } = authSlice.actions;
export default authSlice.reducer;