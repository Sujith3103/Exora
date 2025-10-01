import server from "@/api/axiosinstance"
import CourseLanding from "@/components/instructor-view/course-landing"
import CourseMessage from "@/components/instructor-view/course-messages"
import CourseCurriculum from "@/components/instructor-view/curriculum"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AppDispatch, RootState } from "@/store"
import { courseSliceLoadingStart, courseSliceLoadingStop, setCourseInformation, setCourseSection } from "@/store/courseSlice"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { validateCourse } from "./hooks"
import Instructor_CourseInfo from "@/components/instructor-view/course-info/courseInfo"

const NewCourse = () => {

    const dispatch = useDispatch<AppDispatch>()

    const courseData = useSelector((state: RootState) => state.course.courseInformation)
    const sections = useSelector((state: RootState) => state.course.sections)

    const [isValid, setIsValid] = useState(false)

    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>();

    let location = useLocation()

    const fetchComponentInUrl = () => {
        return location.pathname.split('/')[5]
    }

    const handleClick_saveChanges = async () => {

        if (courseData) {
            const valid = validateCourse({ courseData, sections });
            setIsValid(valid.valid)
        }

        const response = await server.put(`/instructor/course/${id}/landing`, {
            courseInformation: courseData
        })
        if (response.data.success) {
        }
    }

    const handleClick_PublishCourse = async () => {
        try {
            const response = await server.patch(`/instructor/course/${id}/publish`)
            if (response.data.success) {
                console.log("course published")
            }
        } catch (err) {
            console.log(err)
        }
    }


    const fetchCourseLanding = async () => {
        dispatch(courseSliceLoadingStart())
        const valInTab = fetchComponentInUrl()
        if (valInTab != 'course-landing') return

        const response = await server.get(`/instructor/course/${id}/landing`)
        if (response.data.success) {
            dispatch(setCourseInformation({ fromServer: true, data: response.data.course }))
        }
        dispatch(courseSliceLoadingStop())
    }

    const FetchSectionsWhenIdle = () => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(async () => {
                dispatch(courseSliceLoadingStart())
                const response = await server.get(`/instructor/course/get-all-sections/${id}`)
                if (response.data.success) {
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
        <div className="p-5 h-full">
            <Tabs defaultValue={fetchComponentInUrl()}>
                <div className="flex">
                    <TabsList className="flex justify-start rounded-none bg-transparent p-0">
                        <TabsTrigger
                            className="relative bg-transparent rounded-none border-none shadow-none px-4 py-2 text-gray-600 data-[state=active]:text-black  data-[state=active]:font-semibold  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-black after:transition-transform  data-[state=active]:after:scale-x-100"
                            onClick={() => navigate(`/profile/instructor/courses/edit/course-landing/${id}`)} value="course-landing">course-landing</TabsTrigger>
                        <TabsTrigger
                            className="relative bg-transparent rounded-none border-none shadow-none px-4 py-2 text-gray-600 data-[state=active]:text-black  data-[state=active]:font-semibold  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-black after:transition-transform  data-[state=active]:after:scale-x-100"
                            onClick={() => navigate(`/profile/instructor/courses/edit/course-curriculum/${id}`)} value="course-curriculum">course-curriculum</TabsTrigger>
                        <TabsTrigger
                            className="relative bg-transparent rounded-none border-none shadow-none px-4 py-2 text-gray-600 data-[state=active]:text-black  data-[state=active]:font-semibold  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-black after:transition-transform  data-[state=active]:after:scale-x-100"
                            onClick={() => navigate(`/profile/instructor/courses/edit/course-message/${id}`)} value="course-message">course-message</TabsTrigger>
                        <TabsTrigger
                            className="relative bg-transparent rounded-none border-none shadow-none px-4 py-2 text-gray-600 data-[state=active]:text-black  data-[state=active]:font-semibold  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-black after:transition-transform  data-[state=active]:after:scale-x-100"
                            onClick={() => navigate(`/profile/instructor/courses/edit/course-info/${id}`)} value="course-info">course-info</TabsTrigger>
                    </TabsList>
                    {
                        fetchComponentInUrl() != 'course-curriculum' && isValid ? (
                            <Button className="ml-auto" onClick={handleClick_PublishCourse}>Publish Course</Button>
                        ) : (

                            <Button className="ml-auto bg-white text-black border hover:bg-white cursor-pointer border-black" onClick={handleClick_saveChanges}>Save Changes</Button>
                        )

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
                <TabsContent value="course-info">
                    <Instructor_CourseInfo />
                </TabsContent>
            </Tabs >
        </div >
    )
}

export default NewCourse
