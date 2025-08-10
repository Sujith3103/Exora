import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Profile {
    id: string ,
    contact: string ,
    about: string ,
    dob: string ,
    gender: string ,
    profileImg :string ,
    profileBanner :string ,
    profession : string ,
    loading: boolean,
    error: boolean   
}

interface ProfileState {
    data: Profile | null,
    loading: boolean,
    error: boolean
}

const initialState: ProfileState = {
    data: null,
    loading: true,
    error: false
}

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers:{
        setProfile(state, action: PayloadAction<Profile>){
            state.data = action.payload,
            state.loading = false
        }
    }
})  

export const {setProfile} =  profileSlice.actions
export default profileSlice.reducer
