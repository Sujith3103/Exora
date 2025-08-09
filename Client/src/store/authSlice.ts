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
    loading: false,
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
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        }
    }
})


export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;