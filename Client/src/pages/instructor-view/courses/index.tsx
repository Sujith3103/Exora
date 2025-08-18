import server from "@/api/axiosinstance";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CourseDesc {
    CourseImg: string;
    title: string;
    category: string;
    duration: string;
    price: string; // better as string/number
    level: "beginner" | "intermediate" | "advanced";
    status: "published" | "drafted";
}

const InstructorCourses = () => {
    const [courseList, setCourseList] = useState<CourseDesc[]>([
        {
            CourseImg: "https://via.placeholder.com/100",
            title: "React for Beginners course 2025",
            category: "Web Development",
            duration: "10h",
            price: "$49",
            level: "beginner",
            status: "published",
        },
        {
            CourseImg: "https://via.placeholder.com/100",
            title: "Advanced Node.js",
            category: "Backend",
            duration: "15h",
            price: "$79",
            level: "advanced",
            status: "drafted",
        },
    ]);

    const navigate = useNavigate()

    const handleClick_AddNewCourse = async() => {
        const repsonse = await server.post('')
    }   

    useEffect(() => {

        async function fetchData() {
            const response = await server.get('')
        }

        fetchData()

    }, [])


    return (
        <div className="w-full h-full p-5 flex flex-col">
            <h1 className="text-3xl font-semibold">My Courses</h1>

            <div className="w-full mt-10 p-2 flex items-center">
                <p>Total Courses: {courseList.length}</p>
                <Button className="ml-auto bg-blue-500 hover:bg-blue-400 rounded-sm" onClick={() => navigate('/profile/courses/new-course')}>
                    <Plus onClick={handleClick_AddNewCourse}/> New
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courseList.map((course, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={course.CourseImg}
                                            alt={course.title}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <span className="whitespace-nowrap truncate max-w-[200px]">
                                            {course.title}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">{course.category}</TableCell>
                                <TableCell className="text-center">{course.duration}</TableCell>
                                <TableCell className="text-center">{course.price}</TableCell>
                                <TableCell className="text-center capitalize">{course.level}</TableCell>
                                <TableCell className="text-center">{course.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>
        </div>
    );
};

export default InstructorCourses;
