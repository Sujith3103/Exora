import { Label } from "@/components/ui/label"
import Editor from "../text-editor/Editor"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { courseCategories, courseLevelOptions, languageOptions } from "@/config/config"
import { CircleQuestionMark } from "lucide-react"
import CourseFormField from "./course-formfield"
import CourseBasicInfo from "./course-basicInfo"

import UploadImage from '../../../assets-static/placeholderuploadimage.webp'
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import CourseRequirements from "./course-requirements"

const CourseLanding = () => {

  const inputRef = useRef<HTMLInputElement>(null)



  const renderInput = () => {

  }

  return (
    <Card className="p-10 flex flex-col rounded-none">
      <h1 className="font-serif font- text-2xl font-bold">Course landing page</h1>
      <CourseFormField />


      <h3 className="text-md font-semibold ">Baic Info</h3>
      <CourseBasicInfo />

    <CourseRequirements />

      <h3 className="text-md font-semibold ">Course Image</h3>
      <div className="flex">
        <img src={UploadImage} className="w-120 h-64 border border-gray-300" />
        <div>
          <p className="px-15 py-3 font-[Open_Sans]">Upload your course image here. It must meet our course image quality standards to be accepted. Important guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png. no text on the image.</p>
          <div className="flex px-20 py-7 gap-5">
            <Input ref={inputRef} type="file" accept="image/*"/>
            <Button className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-50" onClick={() => inputRef.current?.click()}>Upload File</Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CourseLanding
