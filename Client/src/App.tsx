
import { Route, Routes } from "react-router-dom"
import StudentViewHomePage from "./pages/student-view/home"
import NavBarLayout from "./components/layout"
import AuthPage from "./pages/student-view/auth"
import ProfileLayout from "./pages/student-view/profile-layout"
import OverView from "./components/profile-components/overview"
import RouteGuard from "./components/routeguard"
import InstructorCourses from "./pages/instructor-view/courses"
import NewCourse from "./pages/instructor-view/new-course"
import CourseLanding from "./components/instructor-view/course-landing"
import CourseCurriculum from "./components/instructor-view/curriculum"
import CourseMessage from "./components/instructor-view/course-messages"
import StudentViewCourseLayout from "./components/layout/courseLayout"
import CourseDetails from "./pages/student-view/course-detail"
import Cart from "./pages/student-view/cart"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<RouteGuard element={<NavBarLayout />} />}>
          <Route path="" element={<StudentViewHomePage />} />
        </Route>
        <Route path="/auth" element={<RouteGuard element={<AuthPage />} />}>
          <Route path="login" element={<AuthPage />} />
          <Route path="signup" element={<AuthPage />} />
        </Route>
        <Route path="/" element={<RouteGuard element={<NavBarLayout />} />} >
          <Route path="courses" element={<StudentViewCourseLayout />}>
          </Route>
          <Route path="course/:id" element={<CourseDetails />} />
          <Route path="cart" element={<Cart />} />
        </Route>

        <Route path="/profile" element={<RouteGuard element={<ProfileLayout />} />} >
          <Route path="overview" element={<OverView />} />
          <Route path="instructor/courses" element={<InstructorCourses />}>
          </Route>
          <Route path="instructor/courses/new-course" element={<NewCourse />} />
          <Route path="instructor/courses/edit" element={<NewCourse />}>
            <Route path="course-landing/:id" element={<CourseLanding />} />
            <Route path="course-curriculum/:id" element={<CourseCurriculum />} />
            <Route path="course-message/:id" element={<CourseMessage />} />
          </Route>
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default App
