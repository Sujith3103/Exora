import server from "@/api/axiosinstance";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import type { AppDispatch, RootState } from "@/store";
import {  addNewCourse, setCourseDetails } from "@/store/courseSlice";
import { Edit, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InstructorCoursesSkeleton from "./courseSkeleton";

const InstructorCourses = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const courseData = useSelector(
        (state: RootState) => state.course.courseData
    );

    const [contentFetching,setContentFetching] = useState(false)

    // Placeholder image for empty courses
    const PLACEHOLDER_IMAGE = "/images/placeholder.png";

    const handleClick_EditCourse = (courseid: string) => {
        navigate(`/profile/courses/edit/course-landing/${courseid}`)
    }

    const handleClick_AddNewCourse = async () => {
        try {
            const response = await server.post("/course/create-new");
            if (response.data.success) {
                console.log("created course: ", response.data);
                // Update Redux state with the new course
                dispatch(addNewCourse(response.data.newCourse));
                navigate(`/profile/courses/edit/course-landing/${response.data.newCourse.id}`)
            }
        } catch (error) {
            console.error("Failed to create course:", error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            setContentFetching(true)
            try {
                const response = await server.get(`/course/get-all-courses`);
                if (response.data.success) {
                    // Update Redux state with the new course
                    console.log("res : ",response.data)
                    dispatch(setCourseDetails(response.data.instructorCourses.flat()));
                }
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
            setContentFetching(false)
        }
        fetchData();
    }, [dispatch]);

    if(contentFetching){
        return <InstructorCoursesSkeleton />
    }

    return (
        <div className="w-full h-full p-5 flex flex-col">
            <h1 className="text-3xl font-semibold">My Courses</h1>

            <div className="w-full mt-10 p-2 flex items-center">
                <p>Total Courses: {courseData?.length || 0}</p>
                <Button
                    className="ml-auto bg-blue-500 hover:bg-blue-400 rounded-sm"
                    onClick={handleClick_AddNewCourse}
                >
                    <Plus /> New
                </Button>
            </div>

            <div>
                <Table className="table-auto w-full ">
                    <TableCaption>A list of your recent Courses.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Course</TableHead>
                            <TableHead className="text-center">Category</TableHead>
                            <TableHead className="text-center">Duration</TableHead>
                            <TableHead className="text-center">Price</TableHead>
                            <TableHead className="text-center">Level</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Config</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courseData.map((course) => {
                            <>
                            {console.log("data:  ",courseData)}
                            </>
                            return (
                                <TableRow key={course.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={course.thumbnailUrl || PLACEHOLDER_IMAGE}
                                                alt={course.title || "Course Image"}
                                                className="w-24 h-14 object-cover rounded"
                                            />
                                            <span className="whitespace-nowrap truncate max-w-[200px]">
                                                {course.title || "please enter a title"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {course.category || "none"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {course.duration || "none"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {course.pricing || "0"}
                                    </TableCell>
                                    <TableCell className="text-center capitalize">
                                        {course.level || "none"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {course.status || "drafted"}
                                    </TableCell>
                                    <TableCell className="flex justify-center text-center gap-3">
                                        <Edit
                                            className="text-gray-500"
                                            onClick={() => handleClick_EditCourse(course.id)}
                                        />
                                        <Trash className="text-red-500" />
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default InstructorCourses;
