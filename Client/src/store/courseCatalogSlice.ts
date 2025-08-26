import { createSlice, type PayloadAction } from "@reduxjs/toolkit"


export interface CourseSummary {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    thumbnailUrl: string;
    instructor: {
        id:string,
        name:string,
        email:string,

    }
    level: "beginner" | "intermediate" | "advanced" | "all_levels";
    pricing: number;
    primaryLanguage: string;
    slug: string;
    // maybe ratings or popularity if you have them
}

interface CourseCatalogState {
    data: CourseSummary[];
    loading: boolean;
    error: string | null;
    filters: {
        sortBy?: "latest" | "popular" | "highly-rated" | "highly-reviewed";
        category?: string;
        level?: "beginner" | "intermediate" | "advanced" | "all_levels";
        search?: string
    };
    pagination: {
        page: number,
        limit: number,
        total: number
    }
}

const initialState: CourseCatalogState = {
    data: [],
    loading: false,
    error: null,
    filters: {
        category: undefined,
        sortBy: "highly-reviewed",
        search: ""
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0
    }
}

const courseCatalogSlice = createSlice({
    name: 'courseCatalog',
    initialState,
    reducers: {
        setCourseSummary(state: CourseCatalogState, action: PayloadAction<CourseSummary[]>) {
            state.data = action.payload
        },
    }

})

export const { setCourseSummary } = courseCatalogSlice.actions

export default courseCatalogSlice.reducer