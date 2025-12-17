import { useEffect, useState } from "react";
import server from "@/api/axiosinstance";
import { PlayCircle } from "lucide-react"; // shadcn/lucide icon
import { useNavigate } from "react-router-dom";

type BoughtCourse = {
    id: string;
    courseId: string;
    userId: string;
    price: string;
    timestamp: string;
    course: {
        title: string;
        thumbnailUrl: string;
        instructor: { name: string };
    };
};

const MyLearning = () => {
    const [coursesData, setCoursesData] = useState<BoughtCourse[]>([]);

    const navigate = useNavigate()

    const getAllBoughtCourses = async () => {
        try {
            const res = await server.get(`/user/my-learning`);
            setCoursesData(res.data.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        getAllBoughtCourses();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">My Learning</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {coursesData.map((item) => (
                    <div
                        key={item.id}
                        className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02]"
                        onClick={() => {
                            // 👇 put your navigation logic here (example):
                            navigate(`/course/${item.courseId}/learn/lecture/`)
                        }}
                    >
                        <img
                            src={item.course.thumbnailUrl}
                            alt={item.course.title}
                            className="w-full h-48 object-cover"
                        />

                        {/* Hover overlay with play icon */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                            <PlayCircle className="text-white w-16 h-16" />
                        </div>

                        <div className="p-4 bg-white dark:bg-zinc-900">
                            <h2 className="text-lg font-semibold truncate">
                                {item.course.title}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {item.course.instructor.name}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyLearning;
