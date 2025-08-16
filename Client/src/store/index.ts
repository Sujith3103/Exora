import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import profileReducer from './profileSlice'
import courseReducer from './courseSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        course: courseReducer  
    }
})

//shape of your entire Redux store state.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
