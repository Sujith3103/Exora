import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import CourseFormField from "./course-formfield"
import CourseBasicInfo from "./course-basicInfo"

import UploadImage from '../../../assets-static/placeholderuploadimage.webp'
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"
import CourseRequirements from "./course-requirements"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import server from "@/api/axiosinstance"
import { useParams } from "react-router-dom"
import { setCourseImage } from "@/store/courseSlice"
import CourseLandingSkeleton from "./skeleton"

const CourseLanding = () => {

  const { id } = useParams()

  const inputRef = useRef<HTMLInputElement>(null)

  const dispatch = useDispatch<AppDispatch>()
  const CourselandingState = useSelector((state: RootState) => state.course.CourseLanding)
  const isloading = useSelector((state:RootState) => state.course.loading)


  const handleChange_ImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log(file)
    if (!file) {
      return console.log("No file selected");
    }
    const formData = new FormData();
    formData.append("thumbnail", file);
    try {
      const res = await server.patch(`/media/course/${id}/thumbnail`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (res.data.success) {
        dispatch(setCourseImage(res.data.url))
        console.log(res.data.url)
      }

    } catch (err) {
      console.error("Upload failed", err);
    }
  }

  // const renderInput = () => {

  // }
  useEffect(() => {
    console.log("c : ", CourselandingState)
  }, [])

  if(isloading){
    return <CourseLandingSkeleton />
  }

  return (
    <Card className="p-10 flex flex-col rounded-none">
      <h1 className="font-serif font- text-2xl font-bold">Course landing page</h1>
      <CourseFormField />


      <h3 className="text-md font-semibold ">Basic Info</h3>
      <CourseBasicInfo />

      <CourseRequirements />

      <h3 className="text-md font-semibold ">Course Image</h3>
      <div className="flex">
        <img src={CourselandingState?.courseImg ? CourselandingState?.courseImg : UploadImage} className="w-120 h-64 border border-gray-300" />
        <div>
          <p className="px-15 py-3 font-[Open_Sans]">Upload your course image here. It must meet our course image quality standards to be accepted. Important guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png. no text on the image.</p>
          <div className="flex px-20 py-7 gap-5">
            <Input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleChange_ImageUpload(e)} className="hidden"/>
            {
              !CourselandingState?.courseImg ? <>
                <Input type="file" accept="image/*" />
                <Button className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-50" onClick={() => inputRef.current?.click()}>Upload File</Button>
              </>
                :
                <>
                  <p>uploaded</p>
                  <Button className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-50" onClick={() => inputRef.current?.click()}>Upload File</Button>
                </>
            }

          </div>
        </div>
      </div>
    </Card>
  )
}

export default CourseLanding
