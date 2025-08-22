import server from "@/api/axiosinstance"
import CourseLanding from "@/components/instructor-view/course-landing"
import CourseMessage from "@/components/instructor-view/course-messages"
import CourseCurriculum from "@/components/instructor-view/curriculum"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AppDispatch, RootState } from "@/store"
import { courseSliceLoadingStart, courseSliceLoadingStop, setCourseBasicInfo, setCourseLanding, setCourseLandingDescription, setCoursePricing, setCourseRequirements, setCourseSection } from "@/store/courseSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

const NewCourse = () => {

    const dispatch = useDispatch<AppDispatch>()

    const courseLandingState = useSelector((state: RootState) => state.course.CourseLanding)
    const courseRequirements = useSelector((state: RootState) => state.course.courseRequirements)
    const courseBasicinfo = useSelector((state: RootState) => state.course.courseBasicInfo)
    const coursePricing = useSelector((state: RootState) => state.course.coursePricing)

    const navigate = useNavigate()

    let location = useLocation()

    const fetchComponentInUrl = () => {
        return location.pathname.split('/')[4]
    }

    const handleClick_saveChanges = async () => {

        const response = await server.put(`/course/${id}/landing`, {
            courseBasicinfo, courseLandingState, courseRequirements, coursePricing
        })
        if (response.data.success) {
            console.log("updated course")
            dispatch(setCourseBasicInfo(response.data.courseBasicinfo))
            dispatch(setCourseLanding({ fromServer: true, data: response.data.courseLandingState }))
            dispatch(setCourseRequirements(response.data.courseRequirements))
            dispatch(setCoursePricing(response.data.coursePricing))
        }
        console.log(courseBasicinfo, courseLandingState, courseRequirements, coursePricing)
    }

    const { id } = useParams<{ id: string }>();

    const fetchCourseLanding = async () => {
        dispatch(courseSliceLoadingStart())
        const valInTab = fetchComponentInUrl()
        if (valInTab != 'course-landing') return

        const response = await server.get(`/course/${id}/landing`)
        if (response.data.success) {
            dispatch(setCourseBasicInfo({ fromServer: true, data: response.data.course.courseBasicinfo }))
            dispatch(setCourseLanding({ fromServer: true, data: response.data.course.courseLandingState }))
            dispatch(setCourseRequirements({ data: response.data.course.courseRequirements, fromServer: true }))
            dispatch(setCoursePricing(response.data.course.coursePricing))
        }
        dispatch(courseSliceLoadingStop())
        console.log(response.data)
    }

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

        fetchCourseLanding()
        fetchComponentInUrl()
        FetchSectionsWhenIdle()
    }, [])

    return (
        <div className="p-5">
            <Tabs defaultValue={fetchComponentInUrl()}>
                <div className="flex">
                    <TabsList className="space-x-2">
                        <TabsTrigger onClick={() => navigate(`/profile/courses/edit/course-landing/${id}`)} value="course-landing">course-landing</TabsTrigger>
                        <TabsTrigger onClick={() => navigate(`/profile/courses/edit/course-curriculum/${id}`)} value="course-curriculum">course-curriculum</TabsTrigger>
                        <TabsTrigger onClick={() => navigate(`/profile/courses/edit/course-message/${id}`)} value="course-message">course-message</TabsTrigger>
                    </TabsList>
                    {
                        fetchComponentInUrl() != 'course-curriculum' &&

                        <Button className="ml-auto" onClick={handleClick_saveChanges}>Save Changes</Button>
                    }
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
