import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// ✅ Define a union type for categories
type CourseCategory = | "web-development" | "backend-development" | "data-science" | "machine-learning" | "artificial-intelligence" | "cloud-computing" | "cyber-security" | "mobile-development" | "game-development" | "software-engineering" | string;

type CourseLevel = "beginner" | "intermediate" | "advanced" | string;

// 🔹 Language options
type CourseLanguage = | "english" | "spanish" | "french" | "german" | "chinese" | "japanese" | "korean" | "portuguese" | "arabic" | "russian" | string;

interface CourseDetails {
    courseImg?: string;
    category: CourseCategory; // 👈 category restricted
    duration: string;
    price: string;
    level: "beginner" | "intermediate" | "advanced";
    status: "published" | "drafted";
}

interface CourseBasicInfo {
    category?: CourseCategory; // 👈 same restriction here
    level?: CourseLevel
    primaryLanguage?: CourseLanguage
}

interface UploadState {
    file: File | {};
}


interface CourseLandingData {
    title?: string,
    subtitle?: string,
    description?: string | null,
    searchKey?: string,
    courseImg?: string
}

interface courseState {
    courseData: CourseDetails | null,
    courseBasicInfo: Record<string, string>
    courseRequirements: string[]
    CourseLanding: CourseLandingData | null
    courseImgUpload: UploadState | null
    loading: boolean,
    error: boolean
}

const initialState: courseState = {
    courseData: null,
    courseBasicInfo: {},
    courseRequirements: [],
    CourseLanding: null,
    courseImgUpload: null,
    loading: false,
    error: false
}

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        courseSliceLoadingStart(state: courseState) {
            state.loading = true
        },
        setCourseDetails(state: courseState, action: PayloadAction<CourseDetails>) {
            state.courseData = action.payload
        },
        setCourseRequirements(state: courseState, action: PayloadAction<string>) {
            state.courseRequirements = [...state.courseRequirements, action.payload]
        },
        setCourseBasicInfo(
            state,
            action: PayloadAction<{ key: string; value: string }>
        ) {
            state.courseBasicInfo[action.payload.key] = action.payload.value;
        },
        setCousreLanding(state: courseState, action: PayloadAction<{ key: keyof CourseLandingData, value: string }>) {
            if (state.CourseLanding) {
                state.CourseLanding[action.payload.key] = action.payload.value
            }
        }
        ,
        setCourseLandingDescription(
            state: courseState,
            action: PayloadAction<{ description: string | null }>
        ) {
            if (!state.CourseLanding) {
                state.CourseLanding = {}; // initialize if null
            }
            state.CourseLanding.description = action.payload.description;
        },
        uploadCourseImage(state: courseState, action: PayloadAction<File>) {
            if (!state.courseImgUpload) {
                state.courseImgUpload = { file: action.payload };
            } else {
                state.courseImgUpload.file = action.payload;
            }
        },
        removeCourseRequirement(state: courseState, action: PayloadAction<number>) {
            state.courseRequirements = state.courseRequirements.filter(
                (_, index) => index !== action.payload
            )
        },
        courseSliceLoadingStop(state: courseState) {
            state.loading = false
        }
    }
})


export const { courseSliceLoadingStart, setCourseDetails, setCourseBasicInfo,
    setCourseLandingDescription, setCousreLanding,

    courseSliceLoadingStop, setCourseRequirements, removeCourseRequirement } = courseSlice.actions
export default courseSlice.reducer