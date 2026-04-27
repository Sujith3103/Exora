import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CourseInfo } from "../courseSlice";

interface CourseLandingState {
  data: CourseInfo | null;
  isInitialized: boolean;
}

const initialState: CourseLandingState = {
  data: null,
  isInitialized: false,
};

const courseLandingSlice = createSlice({
  name: "courseLanding",
  initialState,
  reducers: {
    setCourseLanding(state, action: PayloadAction<CourseInfo>) {
      state.data = action.payload;
      state.isInitialized = true;
    },

    updateCourseLanding(state, action: PayloadAction<Partial<CourseInfo>>) {
      if (state.data) {
        state.data = {
          ...state.data,
          ...action.payload,
        };
      }
    },

    addRequirement(state, action: PayloadAction<string>) {
      if (state.data) {
        state.data.requirements.push(action.payload);
      }
    },

    removeRequirement(state, action: PayloadAction<number>) {
      if (state.data) {
        state.data.requirements = state.data.requirements.filter(
          (_, i) => i !== action.payload
        );
      }
    },

    resetCourseLanding(state) {
      state.data = null;
      state.isInitialized = false;
    },
  },
});

export const {
  setCourseLanding,
  updateCourseLanding,
  addRequirement,
  removeRequirement,
  resetCourseLanding,
} = courseLandingSlice.actions;

export default courseLandingSlice.reducer;