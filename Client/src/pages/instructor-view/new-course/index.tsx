import CourseLanding from "@/components/instructor-view/course-landing"
import CourseMessage from "@/components/instructor-view/course-messages"
import CourseCurriculum from "@/components/instructor-view/curriculum"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { RootState } from "@/store"
import { useSelector } from "react-redux"

const NewCourse = () => {

    const courseLandingState = useSelector((state: RootState) => state.course.CourseLanding)
    const courseRequirements = useSelector((state: RootState) => state.course.courseRequirements)
    const courseBasicinfo = useSelector((state: RootState) => state.course.courseBasicInfo)
    const courseImage = useSelector((state: RootState) => state.course.courseImgUpload)

    const handleClick_saveChanges = async() => {
        console.log(courseBasicinfo,courseLandingState,courseRequirements,courseImage)
    }

    return (
        <div className="p-5">
            <Tabs defaultValue="course-landing">
                <div className="flex">
                    <TabsList>
                        <TabsTrigger value="course-landing">course-landing</TabsTrigger>
                        <TabsTrigger value="course-curriculum">course-curriculum</TabsTrigger>
                        <TabsTrigger value="course-message">course-message</TabsTrigger>
                    </TabsList>
                    <Button className="ml-auto" onClick={handleClick_saveChanges}>Save Changes</Button>
                </div>
                <TabsContent value="course-landing">
                    <CourseLanding />
                </TabsContent>
                <TabsContent value="course-curriculum">
                    <CourseCurriculum />
                </TabsContent>
                <TabsContent value="course-message">
                    <CourseMessage />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default NewCourse
