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

  originalPrice?: number;       // price before discount
  discountApplied?: number;     // discount value (flat or % depending on context)
  finalPrice?: number;
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


export const TRANSIENT_RULES = [
  /ECONNREFUSED/,
  /ETIMEDOUT/,
  /EAI_AGAIN/,
  /timeout/i,
  /network error/i
]

export const PERMANENT_RULES = [
  /validation/i,
  /invalid/i,
  /missing/i,
  /not found/i,
  /schema/i,
]