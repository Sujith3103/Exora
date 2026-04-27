import server from "@/api/axiosinstance";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell, } from "@/components/ui/table";
import type { AppDispatch, RootState } from "@/store";
import { addNewCourse, removeCourse, setCourseDetails } from "@/store/courseSlice";
import { Edit, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InstructorCoursesSkeleton from "./courseSkeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const InstructorCourses = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const courseData = useSelector(
        (state: RootState) => state.course.courseData
    );

    const [contentFetching, setContentFetching] = useState(false)
    const [isCreatingCourse, setIsCreatingCourse] = useState<boolean>(false)

    // Placeholder image for empty courses
    const PLACEHOLDER_IMAGE = "/images/placeholder.png";

    const handleClick_EditCourse = (courseid: string) => {
        navigate(`/profile/instructor/courses/edit/course-landing/${courseid}`)
    }

    const handleClick_AddNewCourse = async () => {
        setIsCreatingCourse(true)
        try {
            const response = await server.post("/instructor/course/create-new");
            if (response.data.success) {
                // Update Redux state with the new course
                dispatch(addNewCourse(response.data.newCourse));
                navigate(`/profile/instructor/courses/edit/course-landing/${response.data.newCourse.id}`)
            }
        } catch (error) {
            toast.error("failed to create course", { style: { justifyContent: "center" } })
            console.error("Failed to create course:", error);
        }
        finally {
            setIsCreatingCourse(false)
        }
    };

    const handleClick_deleteCourse = async (courseId: string) => {
        try {
            dispatch(removeCourse(courseId))
            const result = await server.delete(`/instructor/course/${courseId}`)
            if (result.data.success) {
                toast.success("deleted the course successfully", { style: { justifyContent: "center" } })
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        async function fetchData() {
            setContentFetching(true)
            try {
                const response = await server.get(`/instructor/course/get-all-courses`);
                if (response.data.success) {
                    // Update Redux state with the new course
                    console.log("res : ", response.data)
                    dispatch(setCourseDetails(response.data.instructorCourses.flat()));
                }
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
            setContentFetching(false)
        }
        fetchData();
    }, [dispatch]);

    if (contentFetching) {
        return <InstructorCoursesSkeleton />
    }

    return (
        <div className={`w-full h-full p-5 flex flex-col ${isCreatingCourse ? 'cursor-progress' : ''}`}>
            <h1 className="text-3xl font-semibold">My Courses</h1>

            <div className="w-full mt-10 p-2 flex items-center">
                <p>Total Courses: {courseData?.length || 0}</p>
                <Button
                    className="ml-auto bg-blue-500 hover:bg-blue-400 rounded-sm"
                    onClick={handleClick_AddNewCourse}
                    disabled={isCreatingCourse}
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
                                        {course.lengthNum ? <>
                                            {(course.lengthNum / 3600).toFixed(3)} hrs
                                        </> : "none"}
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
                                            className="text-gray-500 cursor-pointer"
                                            onClick={() => handleClick_EditCourse(course.id)}
                                        />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Trash className="text-red-500 cursor-pointer" />
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your
                                                        section and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleClick_deleteCourse(course.id)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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
