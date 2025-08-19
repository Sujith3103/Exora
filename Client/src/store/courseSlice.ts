import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// ✅ Define a union type for categories
type CourseCategory = | "web-development" | "backend-development" | "data-science" | "machine-learning" | "artificial-intelligence" | "cloud-computing" | "cyber-security" | "mobile-development" | "game-development" | "software-engineering" | string;

type CourseLevel = "beginner" | "intermediate" | "advanced" | string;

// 🔹 Language options
type CourseLanguage = | "english" | "spanish" | "french" | "german" | "chinese" | "japanese" | "korean" | "portuguese" | "arabic" | "russian" | string;

interface CourseDetails {
    id: string
    title: string;
    courseImg?: string;
    category: CourseCategory; // 👈 category restricted
    duration: string;
    pricing: number;
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

interface Lectures {
    id: string,
    sectionId: string,
    title: string,
    videoUrl: string,   // URL to CDN (Cloudinary, S3, etc.)
    freePreview: boolean,
    lengthNum?: number,    // length in seconds
    lengthStr?: string,// e.g. "12:34"
    order: number

}

interface CourseLandingData {
    title?: string,
    subtitle?: string,
    description?: string | null,
    searchKey?: string,
    courseImg?: string
}

interface Section {
    id?: string,
    title: string,
    order: number,

    lectures?: Lectures[]
}

interface courseState {
    courseData: CourseDetails[] | [],
    courseBasicInfo: Record<string, string>
    courseRequirements: string[]
    CourseLanding: CourseLandingData | null
    sections: Section[]
    courseImgUpload: UploadState | null
    loading: boolean,
    error: boolean
}

const initialState: courseState = {
    courseData: [],
    courseBasicInfo: {},
    courseRequirements: [],
    CourseLanding: null,
    courseImgUpload: null,
    sections: [],
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
        setCourseDetails(state: courseState, action: PayloadAction<CourseDetails[]>) {
            state.courseData = [...action.payload]
        },

        //------------------------------------------------------------Course Landing------------------------------------------------------------------

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

        //-------------------------------------------------Course Curriculum----------------------------------------------------------------------

        setCourseSection(state: courseState, action: PayloadAction<Section[]>) {
            state.sections = [...action.payload]
        },
        updateCourseSection(state: courseState, action: PayloadAction<Section>) {
            state.sections = [...state.sections, action.payload]
        },
        updateCourseLecture(state: courseState, action: PayloadAction<Lectures>) {
            const newLecture = action.payload;

            // find the correct section
            const section = state.sections.find(sec => sec.id === newLecture.sectionId);
            if (section) {
                if (!section.lectures) {
                    section.lectures = [];
                }
                section.lectures.push(newLecture);
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


export const { courseSliceLoadingStart, setCourseDetails, setCourseBasicInfo,updateCourseLecture,
    setCourseLandingDescription, setCousreLanding, setCourseSection, updateCourseSection,

    courseSliceLoadingStop, setCourseRequirements, removeCourseRequirement } = courseSlice.actions
export default courseSlice.reducer