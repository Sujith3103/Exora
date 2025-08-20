import server from "@/api/axiosinstance"
import CourseLanding from "@/components/instructor-view/course-landing"
import CourseMessage from "@/components/instructor-view/course-messages"
import CourseCurriculum from "@/components/instructor-view/curriculum"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AppDispatch, RootState } from "@/store"
import { courseSliceLoadingStart, courseSliceLoadingStop, setCourseSection } from "@/store/courseSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

const NewCourse = () => {

    const dispatch = useDispatch<AppDispatch>()

    const courseLandingState = useSelector((state: RootState) => state.course.CourseLanding)
    const courseRequirements = useSelector((state: RootState) => state.course.courseRequirements)
    const courseBasicinfo = useSelector((state: RootState) => state.course.courseBasicInfo)
    const courseImage = useSelector((state: RootState) => state.course.courseImgUpload)

    const navigate = useNavigate()

    let location = useLocation()

    const fetchComponentInUrl = () => {
       return location.pathname.split('/')[4]
    }

    const handleClick_saveChanges = async () => {
        console.log(courseBasicinfo, courseLandingState, courseRequirements, courseImage)
    }

    const { id } = useParams<{ id: string }>();

    const FetchSectionsWhenIdle = () => {

        if ('requestIdleCallback' in window) {
            requestIdleCallback(async () => {
                console.log("fetching sections")

                dispatch(courseSliceLoadingStart())
                const response = await server.get(`/course/get-all-sections/${id}`)
                if (response.data.success) {
                    console.log("fetched sections", response.data)

                    dispatch(setCourseSection(response.data.sections))
                }
                dispatch(courseSliceLoadingStop())
            })
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(FetchSectionsWhenIdle, 0);
        }
    }

    useEffect(() => {

        fetchComponentInUrl()
        FetchSectionsWhenIdle()
    }, [])

    return (
        <div className="p-5">
            <Tabs defaultValue={fetchComponentInUrl()}>
                <div className="flex">
                    <TabsList>
                        <TabsTrigger onClick={() => navigate('/profile/courses/edit/course-landing/7b579a5c-1208-44d8-a416-4cf3a6e4a8d6')} value="course-landing">course-landing</TabsTrigger>
                        <TabsTrigger onClick={() => navigate('/profile/courses/edit/course-curriculum/7b579a5c-1208-44d8-a416-4cf3a6e4a8d6')} value="course-curriculum">course-curriculum</TabsTrigger>
                        <TabsTrigger onClick={() => navigate('/profile/courses/edit/course-message/7b579a5c-1208-44d8-a416-4cf3a6e4a8d6')} value="course-message">course-message</TabsTrigger>
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
