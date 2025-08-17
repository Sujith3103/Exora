import CourseLanding from "@/components/instructor-view/course-landing"
import CourseMessage from "@/components/instructor-view/course-messages"
import CourseCurriculum from "@/components/instructor-view/curriculum"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const NewCourse = () => {
    return (
        <div className="p-5">
            <Tabs defaultValue="course-landing">
                <div className="flex">
                    <TabsList>
                        <TabsTrigger value="course-landing">course-landing</TabsTrigger>
                        <TabsTrigger value="course-curriculum">course-curriculum</TabsTrigger>
                        <TabsTrigger value="course-message">course-message</TabsTrigger>
                    </TabsList>
                    <Button className="ml-auto">Save Changes</Button>
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
