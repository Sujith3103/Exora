import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// ✅ Define a union type for categories
type CourseCategory = | "web-development" | "backend-development" | "data-science" | "machine-learning" | "artificial-intelligence" | "cloud-computing" | "cyber-security" | "mobile-development" | "game-development" | "software-engineering" | string;

// type CourseLevel = "beginner" | "intermediate" | "advanced" | string;

// 🔹 Language options
// type CourseLanguage = | "english" | "spanish" | "french" | "german" | "chinese" | "japanese" | "korean" | "portuguese" | "arabic" | "russian" | string;

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

export interface Resources {
    id?: string,
    title: string,
    link: string,
    lectureId?: string,
}

export interface LectureAsset {
    id?: string
    title: string
    url?: string
    publicId?: String
    type: 'VIDEO' | 'PDF' | ''
    createdAt?: string
    status: 'published' | 'pending' | 'failed' | 'uploading',
    lectureId: string
    thumbnailUrl?: string
}

export interface Lectures {
    id: string,
    sectionId: string,
    title: string,
    videoUrl: string,   // URL to CDN (Cloudinary, S3, etc.)
    freePreview: boolean,
    lengthNum?: number,    // length in seconds
    lengthStr?: string,// e.g. "12:34"
    order: number
    lectureAssets?: LectureAsset
    Resource?: Resources[]
}

interface CourseLandingData {
    title?: string,
    subtitle?: string,
    description?: string | null,
    searchKey?: string,
    courseImg?: string
}

export interface Section {
    id?: string,
    title: string,
    order: number,
    courseId: string,
    lectures?: Lectures[]
}

interface courseState {
    courseData: CourseDetails[],
    courseBasicInfo: Record<string, string>
    courseRequirements: string[]
    coursePricing: number
    CourseLanding: CourseLandingData | null
    sections: Section[]
    lectures: Lectures[] | []
    loading: boolean,
    error: boolean
}

const initialState: courseState = {
    courseData: [],
    courseBasicInfo: {},
    courseRequirements: [],
    CourseLanding: null,
    coursePricing: 0,
    sections: [],
    lectures: [],
    loading: true,
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
        addNewCourse(state, action: PayloadAction<CourseDetails>) {
            state.courseData.push(action.payload);
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
        setCourseLanding(state: courseState,action: PayloadAction<{key?: keyof CourseLandingData;value?: string;fromServer: boolean;data?: CourseLandingData}>
        ) {
            if (action.payload.fromServer) {
                // replace whole object safely
                state.CourseLanding = action.payload.data ?? null;
            } else {
                if (state.CourseLanding && action.payload.key && action.payload.value !== undefined) {
                    state.CourseLanding[action.payload.key] = action.payload.value;
                }
            }
        },
        setCoursePricing(state: courseState, action: PayloadAction<number>) {
            state.coursePricing = action.payload
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
        setCourseImage(state:courseState,action:PayloadAction<string>){
            if(state.CourseLanding){
                state.CourseLanding.courseImg = action.payload
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
        setLectureAsset(state: courseState, action: PayloadAction<LectureAsset>) {
            for (const section of state.sections) {
                if (!section.lectures) continue
                const lecture = section.lectures.find(l => l.id === action.payload.lectureId);
                if (lecture) {
                    lecture.lectureAssets = action.payload
                }
            }
        },
        updateSectionTitle: (
            state,
            action: PayloadAction<{ sectionId: string; title: string }>
        ) => {
            const section = state.sections.find(s => s.id === action.payload.sectionId);
            if (section) {
                section.title = action.payload.title;
            }
        },

        updateLectureTitle: (
            state,
            action: PayloadAction<{ sectionId: string; lectureId: string; title: string }>
        ) => {
            const section = state.sections.find(s => s.id === action.payload.sectionId);
            if (section) {
                const lecture = section.lectures?.find(l => l.id === action.payload.lectureId);
                if (lecture) {
                    lecture.title = action.payload.title;
                }
            }
        },

        deleteLecture(state: courseState, action: PayloadAction<Lectures>) {
            const section = state.sections.find(s => s.id === action.payload.sectionId)

            if (section) {
                section.lectures = section.lectures?.filter(l => l.id != action.payload.id)
            }
        },

        deleteSection(state: courseState, action: PayloadAction<Section>) {
            state.sections = state.sections.filter(s => s.id != action.payload.id)
        },

        setResource(state: courseState, action: PayloadAction<{ sectionId: string, lectureId: string, resources: Resources }>) {
            const lecture = state.sections.flatMap(s => s.lectures || []).find(l => l.id === action.payload.lectureId);
            if (lecture) {
                lecture.Resource = [...(lecture.Resource || []), action.payload.resources];
            }
        },

        removeResource(state: courseState, action: PayloadAction<{ sectionId: string, lectureId: string, resourceId: string }>) {
            const lecture = state.sections.flatMap(s => s.lectures || []).find(l => l.id === action.payload.lectureId);

            if (lecture) {
                lecture.Resource = lecture.Resource?.filter(r => r.id != action.payload.resourceId)
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


export const { courseSliceLoadingStart, setCourseDetails, setCourseBasicInfo, updateCourseLecture,setCourseImage,
    setCourseLandingDescription, setCourseLanding,setCourseSection, updateCourseSection, deleteLecture, deleteSection,
    setLectureAsset, updateLectureTitle, updateSectionTitle, setResource, removeResource, addNewCourse, setCoursePricing,
    courseSliceLoadingStop, setCourseRequirements, removeCourseRequirement } = courseSlice.actions
export default courseSlice.reducer