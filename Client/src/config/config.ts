import type { couponForm } from "@/components/instructor-view/coupons/new-coupon/newCoupon";

export const languageOptions = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "german", label: "German" },
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
  { id: "korean", label: "Korean" },
  { id: "portuguese", label: "Portuguese" },
  { id: "arabic", label: "Arabic" },
  { id: "russian", label: "Russian" },
];

export const courseLevelOptions = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "all-levels", label: "All Levels" },
];

export const courseCategories = [
  { id: "web-development", label: "Web Development" },
  { id: "data-science", label: "Data Science" },
  { id: "machine-learning", label: "Machine Learning" },
  { id: "artificial-intelligence", label: "Artificial Intelligence" },
  { id: "cloud-computing", label: "Cloud Computing" },
  { id: "mobile-development", label: "Mobile Development" },
  { id: "game-development", label: "Game Development" },
  { id: "software-engineering", label: "Software Engineering" },
];

export type CourseQueryOptions = {
  category?: string;
  page?: number;
  limit?: number;
  sortBy?: "latest" | "popular" | "highly-rated" |"highly-reviewed";
  level?: "beginner" | "intermediate" | "advanced" | "all-levels";
  instructorId?: string;
};

export type ClickEvent = {
  userId: string;                 // required: user who clicked
  type: "course" | "category" | "instructor";  // required: primary entity clicked
  targetId: string;               // required: ID of the entity clicked
  categoryId?: string;            // optional: related category ID
  categoryName?: string;          // optional: display name
  instructorId?: string;          // optional: related instructor ID
  action?: "click" | "view" | "enroll" | "share"; // optional, default to "click"
  timestamp?: string;             // optional, defaults to now if not provided
  metadata?: ClickMetaData;       // optional: any extra info
};


export type ClickMetaData = {
  // Optional context info for any click
  sessionId?: string;       // session identifier
  referrer?: string;        // where the user came from
  device?: string;          // browser/OS info
  location?: string;        // optional geolocation
  screenWidth?: number;     // optional UI info
  screenHeight?: number;

  // Optional course-specific info
  durationWatched?: number;  // seconds watched if it’s a video
  completed?: boolean;       // has the user completed the course/video?
  progressPercent?: number;  // optional progress percentage

  // Custom dynamic fields for flexibility
  [key: string]: any;
};

export type Coupon = couponForm & {
  id: string
  userId: string
  totalRevenue: number
  timesUsed: number
  timesApplied: number
  createdAt: Date
  updatedAt: Date
}