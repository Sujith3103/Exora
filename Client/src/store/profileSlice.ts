import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Profile {
    id?: string,
    contact: string,
    about?: string,
    dob: string,
    gender: string,
    profileImg?: string,
    profileBanner?: string,
    profession: string,
    loading: boolean,
    error: boolean
}

interface Security {
    twoStepVerification: boolean,
    lastPasswordChange?: string,
    recoveryEmail: string,
    recoveryPhone: string,
    loginAlertsEnabled: boolean

}

interface ProfileState {
    data: Profile | null,
    security: Security | null,
    loading: boolean,
    error: boolean
}

const initialState: ProfileState = {
    data: null,
    security: null,
    loading: true,
    error: false
}

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        profileSliceLoadinStart(state) {
            state.loading = true
        },
        setProfile(state, action: PayloadAction<Profile>) {
            state.data = action.payload,
                state.loading = false
            state.error = false
        },
        setSecurity(state, action: PayloadAction<Security>) {
            state.security = action.payload
            state.loading = false
            state.error = false
        },
        updateProfileImage(state, action: PayloadAction<string>) {
            if (state.data) {
                state.data.profileImg = action.payload;
            }
        },
        profileSliceLoadinStop(state) {
            state.loading = false
        },

    }
})

export const { setProfile, setSecurity, updateProfileImage, profileSliceLoadinStart, profileSliceLoadinStop } = profileSlice.actions
export default profileSlice.reducer
