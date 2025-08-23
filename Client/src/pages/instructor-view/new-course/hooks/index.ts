import type { CourseInfo, Section } from "@/store/courseSlice";

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

type ValidateCourseProps = {
  courseData: CourseInfo;
  sections: Section[];
};

export const validateCourse = ({ courseData, sections }: ValidateCourseProps): ValidationResult => {
  const errors: string[] = [];

  // ------------------------
  // 1️⃣ Course Landing Validations
  // ------------------------
  if (!courseData.title || courseData.title.trim().length < 5) {
    errors.push("Title must be at least 5 characters long.");
  }

  if (!courseData.subtitle || courseData.subtitle.trim().length < 5) {
    errors.push("Subtitle must be at least 5 characters long.");
  }

  if (!courseData.description) {
    errors.push("Description cannot be empty.");
  } else {
    try {
      const descJson = JSON.parse(courseData.description);

      const hasContent =
        Array.isArray(descJson.content) &&
        descJson.content.some(
          (block: any) =>
            (block.type === "paragraph" && block.content?.length > 0) ||
            block.type === "bulletList" ||
            block.type === "orderedList"
        );

      if (!hasContent) {
        errors.push("Description must contain at least one paragraph or list item.");
      }
    } catch {
      errors.push("Description JSON is invalid.");
    }
  }

  if (!Array.isArray(courseData.requirements) || courseData.requirements.length === 0) {
    errors.push("You must provide at least one course requirement.");
  }

  if (typeof courseData.pricing !== "number" || courseData.pricing < 0 || Number.isNaN(courseData.pricing)) {
    errors.push("Pricing must be a valid number greater than or equal to 0.");
  }

  if (!courseData.thumbnailUrl || !courseData.thumbnailUrl.startsWith("http")) {
    errors.push("Thumbnail URL must be valid.");
  }

  // ------------------------
  // 2️⃣ Sections & Lectures Validations
  // ------------------------
  if (!Array.isArray(sections) || sections.length < 1) {
    errors.push("You must have at least 1 section.");
  } else {
    sections.forEach((section) => {
      if (!Array.isArray(section.lectures) || section.lectures.length < 1) {
        errors.push(`Section "${section.title}" must have at least 1 lecture.`);
      } else {
        section.lectures.forEach((lecture) => {
          if (!lecture.lectureAssets) {
            errors.push(
              `Lecture "${lecture.title}" in section "${section.title}" must have a lecture asset.`
            );
          }
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
