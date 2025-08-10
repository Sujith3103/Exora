import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import profileReducer from './profileSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer
    }
})

//shape of your entire Redux store state.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
