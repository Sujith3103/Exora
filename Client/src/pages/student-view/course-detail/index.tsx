import server from "@/api/axiosinstance";
import CourseDetailsLayout from "@/components/layout/course-details";
import Student_CourseDetailsPricing from "@/components/student-view/course-details/course-pricing";
import CourseDetailsBanner from "@/components/student-view/course-details/details-banner";
import CourseDetailsBannerSmall from "@/components/student-view/course-details/details-banner/small";
import { Button } from "@/components/ui/button";
import type { AppDispatch } from "@/store";
import { setCourseCatalogDetails } from "@/store/courseDetailsSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";



export default function CourseDetailsPage() {

    const { id } = useParams<string>()

    const dispatch = useDispatch<AppDispatch>()
    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        function handleScroll() {
            const bannerHeight =
                document.getElementById("top-container")?.offsetHeight || 0;

            // when scroll crosses banner, lock sidebar
            setIsFixed(window.scrollY > bannerHeight + 100);
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        async function fetchData() {
            const response = await server.get(`/courses/${id}`)
            dispatch(setCourseCatalogDetails(response.data.data))
        }
        fetchData()
    }, [id])

    return (
        <>
            <main className="relative w-full h-full ">
                {/* Banner */}
                <div id="top-container"
                    className="w-full h-[50vh] flex bg-[oklch(20.35%_0.0139_285.09deg)]"
                >
                    <CourseDetailsBanner />
                </div>
                <div>
                    <CourseDetailsBannerSmall />
                </div>
                <div className="w-[28%] shrink-0 lg:inline hidden z-10 ">
                    <div
                        className={`${isFixed
                            ? "fixed top-6 right-[10%] w-[28%]" // when fixed
                            : "absolute top-6 right-[10%] w-[28%]" // when absolute
                            }  h-[70vh]`}
                    >
                        <div className=" p-4 top-0 h-[100vh]">
                            <Student_CourseDetailsPricing />
                        </div>
                    </div>
                </div>

                {/* Main content with sidebar */}

                <div className="relative mx-[9%] max-w-7xl flex gap-6 px-6 lg:pr-110 mt-18 ">
                    {/* Left column */}
                    <CourseDetailsLayout />


                    {/* Right column (sidebar) */}

                </div>

            </main>
        </>
    );
}
