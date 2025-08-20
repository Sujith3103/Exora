import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Lectures } from "@/store/courseSlice"
import { Edit2 } from "lucide-react"


type ContentProps = {
  lecture: Lectures
}

const Content = ({ lecture }: ContentProps) => {
  return (
    <div>
      <hr className="border-1 border-gray-200" />
      <div className="flex p-3 items-center">
        <div className="flex items-center gap-1">
          {/* left part */}
          {
            lecture.lectureAssets?.type === 'VIDEO' ?
            <img src={lecture.lectureAssets?.thumbnailUrl? lecture.lectureAssets?.thumbnailUrl : undefined}
          className="h-[60px] w-[110px] border border-gray-400"
          /> :
          <Card className="w-[110px] h-[60px] rounded-none flex justify-center items-center">
            <span className="text-center">PDF</span>
          </Card>
          }
          <div className="flex-col justify-center ml-2 items-center">         
            {/* contents right of image */}
            <p className="font-semibold">{lecture.lectureAssets?.title}</p>
            <p >duration</p>
            <div className="flex gap-2 items-center cursor-pointer">
              <Edit2 strokeWidth={1} className="text-purple-700" size={17}/>
              <p className="text-purple-700">Edit Content</p>
            </div>
          </div>
        </div>
        <div className=" ml-auto">
          {/* right part */}
          <Button className="bg-purple-600 hover:bg-purple-600 cursor-pointer text-white rounded-sm w-30"> Preview </Button>
        </div>
      </div>
    </div>
  )
}

export default Content
