import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface CourseDetails {
    courseImg?: string,
    category: string,
    duration: string,
    price: string,
    level: "beginner" | "intermediate" | "advanced";
    status: "published" | "drafted";
}

interface courseState {
    courseData: CourseDetails | null,
    loading: boolean,
    error: boolean
}

const initialState: courseState = {
    courseData: null,
    loading: false,
    error: false
}

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers:{
        courseSliceLoadingStart(state){
            state.loading = true
        },

        setCourseDetails(state, action: PayloadAction<CourseDetails>){
            state.courseData = action.payload
        },
        courseSliceLoadingStop(state){
            state.loading = false
        }
    }
})

export const { courseSliceLoadingStart ,setCourseDetails,courseSliceLoadingStop } = courseSlice.actions
export default courseSlice.reducer