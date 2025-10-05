
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
import Instructor_CourseInfo from "./components/instructor-view/course-info/courseInfo"
import CouponPage from "./pages/instructor-view/coupons/coupon"
import { Toaster } from "./components/ui/sonner"
import AnalyticsLayout from "./components/layout/analytics/analyticsLayout"
import RevenueDashboard from "./pages/instructor-view/revenue/revenue"
import CommunicationLayout from "./components/layout/communication/communicationLayout"
import Message from "./pages/student-view/messages/message"
import { useEffect } from "react"
import { socket } from "./config/socket"

function App() {

useEffect(() => {
  socket.on("connect", () => {
    console.log("✅ Connected with ID:", socket.id);
  });

  socket.on("new_message", (msg) => {
    console.log("📩 Got new message:", msg);
  });

  return () => {
    socket.off("connect");
    socket.off("new_message");
  };
}, []);

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
            <Route path="course-info/:id" element={<Instructor_CourseInfo />} />
          </Route>
        </Route>

        <Route path="/profile/communication" element={<RouteGuard element={<CommunicationLayout />} />}>

          <Route path="messages" element={<Message />} />
          <Route path="announcement" />

        </Route>

        <Route path="/profile/instructor/coupons" element={<RouteGuard element={<CouponPage />} />} />
        <Route path="/profile/instructor/analytics" element={<RouteGuard element={<AnalyticsLayout />} />}>
          <Route path="revenue" element={<RevenueDashboard />} />
        </Route>

      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "group relative rounded-md shadow-md",
            closeButton: "pointer-events-auto z-50",
            error: "border-2 border-red-500 bg-red-50 text-red-700",
            success: "border-2 border-green-500 bg-green-50 text-green-700",
          },
        }}
      />
    </>
  )
}

export default App
