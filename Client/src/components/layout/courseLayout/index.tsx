import StudentViewCourses from '@/pages/student-view/courses'
import React from 'react'
import { useSearchParams } from 'react-router-dom';

const StudentViewCourseLayout = () => {


    const [searchParams] = useSearchParams();
    const category = searchParams.get('category') || "web-development" ;
    const page = Number(searchParams.get('page')) || 1;


    return (
        <div>
            <StudentViewCourses category={category} page={page}/>
        </div>
    )
}

export default StudentViewCourseLayout
