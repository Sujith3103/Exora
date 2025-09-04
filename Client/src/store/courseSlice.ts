import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// ✅ Define a union type for categories
export type CourseCategory = | "web-development" | "data-science" | "machine-learning" | "artificial-intelligence" | "cloud-computing" | "cyber-security" | "mobile-development" | "game-development" | "software-engineering" | string;

// type CourseLevel = "beginner" | "intermediate" | "advanced" | string;

// 🔹 Language options
// type CourseLanguage = | "english" | "spanish" | "french" | "german" | "chinese" | "japanese" | "korean" | "portuguese" | "arabic" | "russian" | string;

interface CourseDetails {
    id: string
    title: string;
    thumbnailUrl?: string;
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

export interface Section {
    id?: string,
    title: string,
    order: number,
    courseId: string,
    lectures?: Lectures[]
}

// Enum for course status
export type CourseStatus = "draft" | "published" | "archived";
// (⚠️ Update this based on your Prisma enum definition)

// Instructor minimal interface
export interface Instructor {
    id: string;
    name?: string;   // add more fields if needed (email, profilePic, etc.)
}

// Main Course interface
export interface CourseInfo {
    id: string;
    category: string;
    description: string;
    thumbnailUrl?: string;
    thumbnailId?: string;
    language: string;
    level: string;
    lengthNum: number;     // numeric length (e.g., 120)
    lengthStr: string;     // formatted length (e.g., "2h 30m")
    objectives: string;
    primaryLanguage: string;
    pricing: number;
    requirements: string[];  // since Prisma `Json`
    searchkey: string;
    slug: string;
    status: CourseStatus;
    subtitle: string;
    title: string;
    welcomeMessage: string;
}


interface courseState {
    courseInformation: CourseInfo | null,
    courseData: CourseDetails[],
    courseRequirements: string[]
    sections: Section[]
    lectures: Lectures[] | []
    loading: boolean,
    error: boolean
}

const initialState: courseState = {
    courseInformation: null,
    courseData: [],
    courseRequirements: [],
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
        //-----------------------------------------------------------stuff-----------------------------------------------------------------------

        setCourseInformation(
            state,
            action: PayloadAction<{
                fromServer: boolean;
                key?: keyof CourseInfo;
                value?: any;
                data?: CourseInfo;
            }>
        ) {
            const { fromServer, key, value, data } = action.payload;

            if (fromServer && data) {
                // Case 1: Replace whole object from backend
                state.courseInformation = data;
            } else if (!fromServer && key) {
                // Case 2: Update one field only
                if (state.courseInformation) {
                    state.courseInformation = {
                        ...state.courseInformation,
                        [key]: value,
                    };
                } else {
                    // If it's null, initialize with just that key/value
                    state.courseInformation = { [key]: value } as CourseInfo;
                }
            }
        },
        //------------------------------------------------------------Course Landing------------------------------------------------------------------

        setCourseRequirements(state: courseState, action: PayloadAction<{ fromServer: boolean, val?: string, data?: string[] }>) {
            if (action.payload.fromServer) {
                if (action.payload.data && state.courseInformation) {
                    state.courseInformation.requirements = action.payload.data
                }
            }
            else if (action.payload.val && state.courseInformation) {
                state.courseInformation.requirements = [...state.courseInformation?.requirements, action.payload.val]
            }

        },
        setCourseLandingDescription(
            state: courseState,
            action: PayloadAction<{ description: string | null }>
        ) {
            if (state.courseInformation) {
                state.courseInformation.description = action.payload.description ?? "";
            }
        },
        setCourseImage(state: courseState, action: PayloadAction<string>) {
            if (state.courseInformation) {
                state.courseInformation.thumbnailUrl = action.payload
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

        removeCourse(state: courseState,action:PayloadAction<string>){
            state.courseData = state.courseData.filter(c => c.id != action.payload)
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


export const { courseSliceLoadingStart, setCourseDetails, updateCourseLecture, setCourseImage, setCourseInformation,
    setCourseLandingDescription, setCourseSection, updateCourseSection, deleteLecture, deleteSection,removeCourse,
    setLectureAsset, updateLectureTitle, updateSectionTitle, setResource, removeResource, addNewCourse, 
    courseSliceLoadingStop, setCourseRequirements, removeCourseRequirement } = courseSlice.actions
export default courseSlice.reducer