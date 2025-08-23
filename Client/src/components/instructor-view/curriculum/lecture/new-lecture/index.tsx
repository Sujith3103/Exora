import server from "@/api/axiosinstance"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { AppDispatch } from "@/store"
import { updateCourseLecture } from "@/store/courseSlice"
import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

type NewLectureProps = {
  sectionId: string
  setIsAddingLecture: React.Dispatch<
    React.SetStateAction<{
      sectionId: string | null
      addingLecture: boolean
    }>
  >
}

const NewLecture = ({ sectionId, setIsAddingLecture }: NewLectureProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // triggers the slide down on mount
  }, []);


  const handleCLick_AddNewLecture = async () => {
    const value = inputRef.current?.value.trim()
    if (!value) return

    const response = await server.post(`/instructor/course/create-lecture/${id}`, {
      title: value,
      sectionId: sectionId, // ✅ send sectionId
    })

    if (response.data.success) {
      dispatch(updateCourseLecture(response.data.createdLecture))
    }

    // reset state after adding lecture
    setIsAddingLecture({ sectionId: null, addingLecture: false })

  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Card
  className={`flex flex-col p-7 transition-transform duration-500 ease-out ${
    isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
  }`}
>
      <div className="flex gap-3 items-center">
        <h1 className="whitespace-nowrap">New Lecture:</h1>
        <Input
          ref={inputRef}
          className="focus-visible:ring-0 focus-visible:ring-offset-0 
                     focus:border-purple-500 border"
        />
      </div>
      <div className="flex gap-3 ml-auto">
        <Button
          className="w-30 bg-white text-purple-500 hover:bg-white border hover:border-purple-600"
          onClick={() => setIsAddingLecture({ sectionId: null, addingLecture: false })}
        >
          Cancel
        </Button>
        <Button
          className="w-30 bg-purple-500 hover:bg-purple-400"
          onClick={handleCLick_AddNewLecture}
        >
          Add Lecture
        </Button>
      </div>
    </Card>
  )
}

export default NewLecture
