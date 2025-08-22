import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";


const prisma = new PrismaClient();

export const GetAllCourses = async (req: Request, res: Response) => {

    const userId = req.user?.id as string
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })

    try {

        // Get all courses by an instructor
        const instructorCourses = await prisma.course.findMany({
            where: { instructorId: userId },
            select: {
                id: true,
                title: true,
                level: true,
                category: true,
                thumbnailUrl: true,
                pricing: true,
                status: true,
                lengthStr: true
            }
        });

        if (!instructorCourses) return res.status(404).json({ success: false, message: "courses not found" })

        // console.log("instructor courses : ", instructorCourses)

        return res.status(200).json({
            success: true,
            message: "fetched instructor courses",
            instructorCourses: instructorCourses
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "failed fetching courses"
        })
    }

}

const getNextSectionOrder = async (courseId: string) => {
    const lastSection = await prisma.section.findFirst({
        where: { courseId },
        orderBy: { order: "desc" },
    });
    return lastSection ? lastSection.order + 1 : 1;
};
export const GetAllSections = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id as string;

        const courseId = req.params.id; // 👈 extract param from URL

        const sections = await prisma.section.findMany({
            where: { courseId },
            include: {
                lectures: {
                    include: {
                        lectureAssets: true,
                        Resource: true,
                    }
                }

            },
            orderBy: { order: "asc" }
        })

        return res.status(200).json({
            success: true,
            message: "fetched course-sections successfully",
            sections
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            successs: false,
            message: "failed to retrive course-sections"
        })
    }



}

export const getCourseLanding = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        primaryLanguage: true,
        level: true,
        category: true,
        title: true,
        subtitle: true,
        description: true,
        searchkey: true,
        thumbnailUrl: true,
        requirements: true,
        pricing:true
      },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({
      success: true,
      course: {
        courseBasicinfo: {
          primaryLanguage: course.primaryLanguage,
          level: course.level,
          category: course.category,
        },
        courseLandingState: {
          title: course.title,
          subtitle: course.subtitle,
          description: course.description,
          courseImg: course.thumbnailUrl,
          searchKey: course.searchkey,
        },
        courseRequirements: course.requirements || [],
        coursePricing:  course.pricing || 0,
      },
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "could not fetch course landing data",
    });
  }
};


export const AddNewCourse = async (req: Request, res: Response) => {

    const userId = req.user?.id as string
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })

    try {

        const instructor = await prisma.user.findFirst({
            where: { id: userId }
        })

        if (instructor?.role !== 'INSTRUCTOR') return res.status(401).json({ success: false, message: "Unauthorized" })

        const newCourse = await prisma.course.create({
            data: {
                title: "",
                category: "",
                level: "",
                primaryLanguage: "",
                subtitle: "",
                language: "",
                description: "",
                pricing: 0,
                objectives: "",
                welcomeMessage: "",
                requirements: [],          // empty array for Json
                searchkey: "",
                slug: `temp-slug-${Date.now()}`,         // must be unique
                lengthNum: 0,
                lengthStr: "",
                status: "drafted",         // default enum value
                instructorId: userId,

            }
        });

        console.log("course: ", newCourse)

        res.status(200).json({
            success: true,
            message: "course created successfully",
            newCourse
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "failed creating a new course"
        })
    }

}


// helper to get the next section order

const getNextLectureOrder = async (sectionId: string) => {
    const lastLecture = await prisma.lecture.findFirst({
        where: { sectionId },
        orderBy: { order: "desc" },
    });
    return lastLecture ? lastLecture.order + 1 : 1;
}

export const updateCourseLanding = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const { courseBasicinfo, courseLandingState, courseRequirements,coursePricing } = req.body;

    try {
        const updated = await prisma.course.update({
            where: { id: courseId },
            data: {
                primaryLanguage: courseBasicinfo.primaryLanguage,
                level: courseBasicinfo.level,
                category: courseBasicinfo.category,
                title: courseLandingState.title,
                subtitle: courseLandingState.subtitle,
                description: courseLandingState.description,
                thumbnailUrl: courseLandingState.courseImg,
                searchkey: courseLandingState.searchKey,
                requirements: courseRequirements,
                pricing: coursePricing
            },
        });

        // Rebuild to the same structure client expects
        res.status(200).json({
            success: true,
            courseBasicinfo: {
                primaryLanguage: updated.primaryLanguage,
                level: updated.level,
                category: updated.category,
            },
            courseLandingState: {
                title: updated.title,
                subtitle: updated.subtitle,
                description: updated.description,
                courseImg: updated.thumbnailUrl,
                searchKey: updated.searchkey,
            },
            courseRequirements: updated.requirements,
            coursePricing: updated.pricing
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update course" });
    }
};

//create
export const CreateLecture = async (req: Request, res: Response) => {

    try {
        const userId = req.user?.id as string;

        const { sectionId, title } = req.body
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const createdLecture = await prisma.lecture.create({
            data: {
                title: title,
                freePreview: false,
                lengthNum: 0,
                lengthStr: '',
                sectionId: sectionId,
                order: await getNextLectureOrder(sectionId)
            }
        })

        console.log("created lecture :", createdLecture)

        return res.status(200).json({
            success: true,
            message: "created lecture successfully",
            createdLecture
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "failed creating a lecture"
        })
    }
}
export const CreateSection = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id as string;
        const courseId = req.params.id; // 👈 extract param from URL

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { title } = req.body;

        if (!title || !courseId) {
            return res.status(400).json({ success: false, message: "Title and courseId are required" });
        }

        const createdSection = await prisma.section.create({
            data: {
                title,
                courseId, // assuming a section belongs to a course
                order: await getNextSectionOrder(courseId), // 👈 helper to keep sections ordered
            },
        });

        console.log("created section : ", createdSection)

        return res.status(201).json({ success: true, section: createdSection });
    } catch (error) {
        console.error("Error creating section:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
export const createResource = async (req: Request, res: Response) => {
    console.log(req.body)
    const { title, link } = req.body
    const { lectureId } = req.params
    try {

        const createdResource = await prisma.resource.create({
            data: { link, title, lectureId }
        })

        return res.status(200).json({
            success: true,
            message: "create resource",
            resource: createdResource
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "failed to create resource"
        })
    }
}

//update
export const UpdateSectionTitle = async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const { title } = req.body

    const { sectionId } = req.params
    const { courseId } = req.params

    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {

        const updatedSection = await prisma.section.update({
            where: {
                id: sectionId,
                courseId: courseId
            },
            data: {
                title: title
            }
        })

        return res.status(200).json({
            success: true,
            message: "updated section title successfully",
            section: updatedSection
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Failed to update section title"
        })
    }
}
export const UpdateLectureTitle = async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    console.log(req.body)
    const { title } = req.body;
    const { lectureId, sectionId } = req.params;

    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const updatedLecture = await prisma.lecture.update({
            where: {
                id: lectureId,
                sectionId: sectionId
            },
            data: { title }
        });

        return res.status(200).json({
            success: true,
            message: "Updated lecture title successfully",
            lecture: updatedLecture
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to update lecture title"
        });
    }
};


//delete
export const deleteLecture = async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { sectionId, lectureId } = req.params;

    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        // ✅ Check lecture exists and belongs to section
        const lecture = await prisma.lecture.findFirst({
            where: {
                id: lectureId,
                sectionId,
            },
        });

        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        // ✅ Delete by id
        await prisma.lecture.delete({
            where: { id: lectureId },
        });

        return res.status(200).json({
            success: true,
            message: "Deleted lecture",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete lecture",
        });
    }
};

export const deleteSection = async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { courseId, sectionId } = req.params;

    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        // 🔹 Check section exists and belongs to course
        const section = await prisma.section.findFirst({
            where: {
                id: sectionId,
                courseId: courseId,
            },
        });

        if (!section) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        // 🔹 Optional: Check if user owns this course (important for multi-user apps)
        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                instructorId: userId, // assuming your course has instructorId
            },
        });

        if (!course) {
            return res.status(403).json({ success: false, message: "Forbidden: You don't own this course" });
        }

        // 🔹 Delete the section (Prisma cascades only if you set `onDelete: Cascade` in schema)
        await prisma.section.delete({
            where: { id: sectionId },
        });

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting section:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete section",
        });
    }
};

export const deleteResource = async (req: Request, res: Response) => {
    const { lectureId, sectionId, resourceId } = req.params;

    try {
        // ✅ delete resource by ID and its relation
        const deleted = await prisma.resource.delete({
            where: { id: resourceId },
        });

        return res.status(200).json({
            success: true,
            message: "Resource deleted successfully",
            resource: deleted,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete resource",
        });
    }
};
