import CategoryBar from '@/components/student-view/courses/categorybar';
import CourseTabs from '@/components/student-view/courses/courseTabs/courseTabs';
import type { CourseQueryOptions } from '@/config/config';
import StudentViewCourses from '@/pages/student-view/courses'
import { useSearchParams } from 'react-router-dom';

const StudentViewCourseLayout = () => {


    const [searchParams] = useSearchParams();
    const category = searchParams.get('category') || "web-development";
    const page = Number(searchParams.get('page')) || 1;
    const limit = 10

    const queryOptions: CourseQueryOptions = {
        category: category,
        page: page,
        limit: limit,

    }

    return (
        <>
            <CategoryBar />

            <div className='h-full w-full xl:px-20 px-10'>

                <p className='text-4xl font-bold font-serif  mt-[4%]'>Development Courses</p>
                <div className=' mt-13'>
                    <CourseTabs />
                </div>

                <StudentViewCourses {...queryOptions} />
            </div>
        </>
    )
}

export default StudentViewCourseLayout
