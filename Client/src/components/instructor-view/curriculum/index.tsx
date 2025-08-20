import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { AppDispatch, RootState } from "@/store"
import { courseSliceLoadingStart, courseSliceLoadingStop, setCourseSection } from "@/store/courseSlice"
import { CircleCheck, Edit2, FileTextIcon, Plus, Trash2Icon, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import NewSection from "./section"
import { useParams } from "react-router-dom"
import server from "@/api/axiosinstance"
import CurriculumSkeleton from "./curriculumSkeleton"
import NewLecture from "./lecture/new-lecture"
import Content from "./content/new-content"
import Lecture from "./lecture"

type AddingLectureState = {
  sectionId: string | null;
  addingLecture: boolean;
};

// type Section = {
//   sectionTitle: string
//   order: number
// }



const CourseCurriculum = () => {


  const sections = useSelector((state: RootState) => state.course.sections)
  const isLoading = useSelector((state: RootState) => state.course.loading)
  const dispatch = useDispatch<AppDispatch>()
  const initalInputRef = useRef<HTMLInputElement>(null)

  const [isAddingSection, setIsAddingSection] = useState(false)
  // const [isAddingContent, setIsAddingContent] = useState(false)


  const [isAddingLecture, setIsAddingLecture] = useState<AddingLectureState>({
    sectionId: null,
    addingLecture: false,
  });
  const [isEditTitle, setIsEditTitle] = useState(false)


  const a = 0
  const handleClick_AddNewLecture = (sectionId: any) => {
    setIsAddingLecture((prev) => ({
      sectionId,
      addingLecture: prev.sectionId === sectionId ? !prev.addingLecture : true,
    }));

  };

  const { id } = useParams<{ id: string }>();

  // useEffect(() => {

  //   async function FetchSections() {
  //     console.log("fetching sections")

  //     dispatch(courseSliceLoadingStart())
  //     const response = await server.get(`/course/get-all-sections/${id}`)
  //     if (response.data.success) {
  //       console.log("fetched sections", response.data)

  //       dispatch(setCourseSection(response.data.sections))
  //     }
  //     if (a) {
  //       setIsEditTitle(false)
  //     }
  //     dispatch(courseSliceLoadingStop())
  //   }
  //   // if ( sections.length === 0) {
  //   //   FetchSections();
  //   // }
  //   FetchSections()

  // }, [])

  if (isLoading) {
    return <CurriculumSkeleton />
  }

  return (
    <div className="md:px-10 overflow-x-auto">
      <Card className="md:p-10 p-5 md:px-15 rounded-lg shadow-md mt-5 border border-gray-200 overflow-x-auto">
        {sections && sections.length > 0 ? (
          <div className="space-y-10">
            <>
              {/* {console.log("sections : ",sections,sections.length )} */}
            </>
            {sections.map((section) => {
              if (!section.id) {
                return <NewSection setIsAddingSection={setIsAddingSection} key={section.id} />
              }

              return (
                <Card
                  key={section.id}
                  className="p-5 border border-gray-200 rounded-md shadow-sm overflow-x-auto"
                >
                  <div className="flex flex-col sm:flex-col gap-3">
                    <div className="flex items-center gap-3 group">
                      <h1 className="font-semibold text-gray-800">
                        Section {section.order}:
                      </h1>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FileTextIcon size={16} strokeWidth={1.5} />
                        {
                          !isEditTitle ? (
                            <span>{section.title}</span>
                          ) : (
                            <Input className="w-full" ref={initalInputRef} />
                          )
                        }

                      </div>
                      <div className="flex gap-1 items-center opacity-0 group-hover:opacity-100">
                        <Edit2 size={13} />
                        <Trash2Icon size={15} strokeWidth={1} className="text-red-700" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:ml-10">

                      {/* -------------------------------------------------Lecture---------------------------------------------------------------------- */}
                      
                      {section.lectures?.map((lecture, index) => (
                        <Lecture key={lecture.id} lecture={lecture} index={index}  />
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handleClick_AddNewLecture(section.id)}
                      className="flex items-center gap-1 ml-10 rounded-none mt-3 text-purple-600 border-purple-500 hover:bg-purple-100 w-35"
                    >

                      <Plus size={16} /> Add Lecture
                    </Button>
                    {
                      isAddingLecture.addingLecture && isAddingLecture.sectionId === section.id && <NewLecture setIsAddingLecture={setIsAddingLecture} sectionId={section.id} />
                    }
                  </div>
                </Card>
              )
            })}

            <Button
              variant="outline"
              className="flex w-35 items-center gap-1 text-purple-600 border-purple-500 hover:bg-purple-100 transition-all duration-300"
              onClick={() => setIsAddingSection((prev) => !prev)}
            >
              {/* Icon wrapper */}
              <span
                className={`transition-transform duration-300 ${isAddingSection ? "rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100"
                  }`}
              >
                <Plus size={16} />
              </span>
              <span
                className={`transition-transform duration-300 ${isAddingSection ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0 absolute"
                  }`}
              >
                <X size={16} />
              </span>

              {/* Text wrapper */}
              <span
                className={` transition-all duration-300 ${isAddingSection ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 absolute"
                  }`}
              >
                Cancel
              </span>
              <span
                className={` transition-all duration-300 ${isAddingSection ? "opacity-0 translate-x-2 absolute" : "opacity-100 translate-x-0"
                  }`}
              >
                Add Section
              </span>
            </Button>

            {isAddingSection && <NewSection setIsAddingSection={setIsAddingSection} />}
          </div>
        ) : (
          <NewSection setIsAddingSection={setIsAddingSection} />
        )}
      </Card>
    </div>
  )
}

export default CourseCurriculum
