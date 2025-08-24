import CategoryBar from '@/components/student-view/courses/categorybar';
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
        <div className='h-full w-full'>
            <CategoryBar />

            <StudentViewCourses {...queryOptions} />
        </div>
    )
}

export default StudentViewCourseLayout
