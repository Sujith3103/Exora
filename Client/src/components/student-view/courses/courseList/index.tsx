import { Card } from "@/components/ui/card"
import type { ClickEvent } from "@/config/config"
import { trackClick } from "@/services/userService"
import type { RootState } from "@/store"
import type { CourseSummary } from "@/store/courseCatalogSlice"
import { useSelector } from "react-redux"
import Pagination from "./pagination"
import { useState, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"

const CourseList = () => {
  const courseCatalog = useSelector((state: RootState) => state.courseCatalog.data)
  const totalPages = useSelector((state: RootState) => state.courseCatalog.pagination.totalPages)
  const user = useSelector((state: RootState) => state.auth.user)

  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const category = searchParams.get("category") || "all"

  // Pull initial page from URL if present
  const initialPage = Number(searchParams.get("page")) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    navigate(`/courses?category=${category}&page=${page}&limit=10`)
  }

  const handleClick_ClickEvent = useCallback(
    async (course: CourseSummary) => {
      navigate(`/course/${course.id}`)
      if (!user) return
      const clickEvent: ClickEvent = {
        userId: user.id.toString(),
        type: "course",
        targetId: course.id,
        categoryId: course.category,
        instructorId: course.instructor.id,
      }
      try {
        await trackClick(clickEvent)
      } catch (err) {
        console.error("Failed to track click", err)
      }
    }, [user]
  )

  return (
    <div className="mt-5 flex-1">
      {courseCatalog.map((course) => (
        <div key={course.id}>
          <Card
            key={course.id}
            className="flex flex-row gap-0 w-full sm:p-4 border-0 shadow-none border-b border-gray-300 last:border-b-0"
          >
            <div className="flex-shrink-0 w-[35%]  max-w-[311px]">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                loading="lazy"
                decoding="async"
                className="w-full h-auto max-h-[175px] aspect-video object-cover cursor-pointer"
                onClick={() => handleClick_ClickEvent(course)}
              />
            </div>

            <div className="flex flex-col ml-3 gap-[2px] flex-grow">
              <p
                className="font-bold line-clamp-2 cursor-pointer"
                onClick={() => handleClick_ClickEvent(course)}
              >
                {course.title}
              </p>
              <p className="text-sm line-clamp-2">{course.subtitle}</p>
              <p className="text-[12px] text-muted-foreground">{course.instructor.name}</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>⭐ Ratings</li>
                <li>⏱ Duration • # Lectures</li>
              </ul>
            </div>

            <span className="ml-auto font-bold">${course.pricing}</span>
          </Card>


          <div className="px-2">
            <hr className="border-gray-300" />
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default CourseList
