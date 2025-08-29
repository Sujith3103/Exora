import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// --- Interfaces for detailed course ---
export interface Lectures {
    id: string;
    sectionId: string;
    title: string;
    contentType: "VIDEO" | "TEXT" | "QUIZ";
    contentUrl?: string;
    durationSec?: number;
}

export interface Section {
    id: string;
    courseId: string;
    title: string;
    order: number;
    lectures: Lectures[];
}

export interface UserPurchase {
    id: string;
    userId: string;
    courseId: string;
    purchasedAt: string;
}

export interface CourseAnalytics {
    trending: number;
    views: number;
    enrollments: number;
}

export interface Instructor {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    profession:string
    updatedAt : true
}

export interface CourseDetails {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    description: string;
    thumbnailUrl?: string;
    thumbnailId?: string;
    language: string;
    level: "beginner" | "intermediate" | "advanced" | "all_levels";
    lengthNum: number;
    lengthStr: string;
    objectives: string;
    primaryLanguage: string;
    pricing: number;
    requirements: any;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    createdAt: string;
    updatedAt?: string;
    purchases?: UserPurchase[];
    instructor: Instructor;
    sections?: Section[];
    courseAnalytics?: CourseAnalytics;
}

// --- Slice state ---
interface CourseCatalogDetailsState {
    data: CourseDetails | null;
    loading: boolean;
    error: boolean
}

const initialState: CourseCatalogDetailsState = {
    data: null,
    loading: true,
    error: false,
};

// --- Slice ---
const courseCatalogDetailsSlice = createSlice({
    name: "courseCatalogDetails",
    initialState,
    reducers: {
        fetchCourseDetailsStart(state:CourseCatalogDetailsState) {
            state.loading = true
            state.error = false
        },
        setCourseCatalogDetails(state: CourseCatalogDetailsState, action: PayloadAction<CourseDetails>) {
            state.data = action.payload
        },
        fetchCourseDetailsStop(state:CourseCatalogDetailsState,action:PayloadAction<{isError:boolean}>) {
            state.loading = false
            state.error = action.payload.isError
        },

    },
});

export const { setCourseCatalogDetails,fetchCourseDetailsStart,fetchCourseDetailsStop } =

    courseCatalogDetailsSlice.actions;

export default courseCatalogDetailsSlice.reducer;
