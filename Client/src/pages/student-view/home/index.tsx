import StudentViewHeroBanner from "@/components/student-view/herobanner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { courseCategories } from "@/config/config";
import { usePopularCourses } from "@/hooks/queries/usePopularCourses";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
// import { useEffect } from "react";
import teachingImage from "../../../assets-static/Teaching-cuate.png"

const StudentViewHomePage = () => {
  const { data, isLoading, isError } = usePopularCourses();
  const navigate = useNavigate();

  return (
    <div className="space-y-16">
      {/*  Hero Banner */}
      <div>
        <StudentViewHeroBanner />
      </div>

      {/* Explore Courses */}
      <div className="px-12">
        <h1 className="text-3xl font-bold mb-6">Explore Courses:</h1>
        <Card className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {courseCategories.map((item) => (
            <Button
              key={item.label}
              variant="outline"
              className="w-full"
              onClick={() =>
                navigate(
                  `/courses?category=${encodeURIComponent(
                    item.id
                  )}&page=1&limit=10`
                )
              }
            >
              {item.label}
            </Button>
          ))}
        </Card>
      </div>

      {/* 🟣 Become an Instructor */}
      <div className="relative mx-10 my-20 overflow-hidden rounded-2xl shadow-2xl">
        {/* Background Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 opacity-95"></div>

        {/* Subtle floating pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10"></div>

        {/* Content Layer */}
        <div className="relative z-10 p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 text-white">

          {/* Left Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Become an Instructor <br /> <span className="text-yellow-300">Inspire the Next Generation!</span>
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto lg:mx-0">
              Transform your knowledge into impact. Create and teach courses that reach thousands of eager learners around the world.
              Build your brand, earn income, and make a real difference.
            </p>

            {/* <div className="flex justify-center lg:justify-start gap-4 mt-6">
              <Button
                variant="secondary"
                className="bg-white text-purple-700 hover:bg-yellow-300 hover:text-black font-semibold px-8 py-6 rounded-full text-lg transition-all"
              >
                Start Teaching Today
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-700 font-semibold px-8 py-6 rounded-full text-lg transition-all"
              >
                Learn More
              </Button>
            </div> */}
          </div>

          {/* Right Image/Illustration */}
          <div className="flex-1 flex justify-center">
            <img
              src={teachingImage}
              alt="Instructor Illustration"
              className="w-72 md:w-96 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>


      {/* 🟣 Popular Courses */}
      <div className="px-12">
        <h1 className="text-3xl font-bold mb-6">Popular Courses</h1>

        {/* Loading & Error states */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-6 h-6 text-purple-600" />
          </div>
        ) : isError ? (
          <p className="text-red-500 text-center">Failed to load courses.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.data?.map((item: any) => {
              const course = item.course;
              return (
                <Card
                  key={course.id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  <div className="h-40 rounded-md mb-4 overflow-hidden bg-gray-200">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <h2 className="font-semibold text-lg truncate">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                    {course.subtitle || "No description available."}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-semibold text-purple-700">
                      ₹{course.pricing}
                    </span>
                    {/* <Button
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course/${course.id}`);
                      }}
                    >
                      Enroll
                    </Button> */}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>


      <p></p>
    </div>
  );
};

export default StudentViewHomePage;
