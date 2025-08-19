import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AppDispatch, RootState } from "@/store"
import { courseSliceLoadingStart, courseSliceLoadingStop, setCourseSection } from "@/store/courseSlice"
import { FileTextIcon, Plus } from "lucide-react"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import NewSection from "./section"
import { useParams } from "react-router-dom"
import server from "@/api/axiosinstance"
import { isloading } from "@/store/authSlice"
import CurriculumSkeleton from "./curriculumSkeleton"

const CourseCurriculum = () => {
  type Section = {
    sectionTitle: string
    order: number
  }

  const sections = useSelector((state: RootState) => state.course.sections)
  const isLoading = useSelector((state: RootState) => state.course.loading)
  const dispatch = useDispatch<AppDispatch>()
  const initalInputRef = useRef<HTMLInputElement>(null)

  // const handleClick_AddSection = () => {
  //   if (initalInputRef.current) {
  //     const value = initalInputRef.current.value.trim()
  //     if (!value) return

  //     const newSection: Section = {
  //       sectionTitle: value,
  //       order: sections.length + 1,
  //     }

  //     dispatch(setCourseSection(newSection))
  //     initalInputRef.current.value = "" // reset input
  //   }
  // }

  // const handleClick_AddNewSection = () => {
  //   const newSection: Section = {
  //     sectionTitle: '',
  //     order: sections.length + 1,
  //   }
  //   dispatch(setCourseSection(newSection))
  // }
  const { id } = useParams<{ id: string }>();

  useEffect(() => {

    async function FetchSections() {
      dispatch(courseSliceLoadingStart())
      const response = await server.get(`/course/get-all-sections/${id}`)
      if (response.data.success) {
        dispatch(setCourseSection(response.data.sections))
      }
      dispatch(courseSliceLoadingStop())
      console.log(response)
    }
    FetchSections()

  }, [])

  useEffect(() => {
    console.log("sections :", sections)
  }, [sections])

  if (isLoading) {
    return <CurriculumSkeleton />
  }
  
  return (
    <Card className="p-6 sm:p-10 rounded-lg shadow-md mt-5 border border-gray-200">
      {sections && sections.length > 0 ? (
        <div className="space-y-5">
          {sections.map((section) => {
            if (!section.id) {
              return <NewSection key={section.id} />
            }

            return (
              <Card
                key={section.id}
                className="p-5 border border-gray-200 rounded-md shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h1 className="font-semibold text-gray-800">
                      Section {section.order}:
                    </h1>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FileTextIcon size={16} strokeWidth={1.5} />
                      {
                        section.title ? (

                          <span>{section.title}</span>
                        ) : (
                          <Input className="w-full" ref={initalInputRef} />
                        )
                      }
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 text-purple-600 border-purple-500 hover:bg-purple-100"
                  >
                    <Plus size={16} /> Add Lecture
                  </Button>
                </div>
              </Card>
            )
          })}

          <Button
            variant="outline"
            className="flex items-center gap-1 mt-15 text-purple-600 border-purple-500 hover:bg-purple-100"
          // onClick={handleClick_AddNewSection}
          >
            <Plus size={16} /> Add Section
          </Button>
        </div>
      ) : (
        <NewSection />
      )}
    </Card>
  )
}

export default CourseCurriculum
