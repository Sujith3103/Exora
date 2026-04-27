import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Lectures } from "@/store/courseSlice"
import { Edit2 } from "lucide-react"
import NewContent from "./new-content"
import { useEffect } from "react"


type ContentProps = {
  lecture: Lectures
  setShowContent: React.Dispatch<React.SetStateAction<{
    uploadingContent: boolean,
    selectingContent: boolean,
    LectureId: string | null
  }>>
  showContent: {
    uploadingContent: boolean,
    selectingContent: boolean,
    LectureId: string | null
  }
  setShowSubContent: React.Dispatch<React.SetStateAction<boolean>>
}

const Content = ({ lecture, showContent, setShowContent, setShowSubContent }: ContentProps) => {

  // const [isEditContent, setIsEditContent] = useState(false)

  function handleClick_EditContent() {
    console.log("editing : ", lecture.title)
    setShowContent(prev => ({
      ...prev,
      selectingContent: true,
      LectureId: lecture.id
    }))
  }

  if (showContent.selectingContent || showContent.uploadingContent && lecture.lectureAssets?.status === 'published') {
    return <NewContent sectionId={lecture.sectionId} showContent={showContent} setShowContent={setShowContent} lectureId={lecture.id} lectureData={lecture} setShowSubContent={setShowSubContent} />
  }

  return (
    <div>
      <hr className="border-1 border-gray-200" />
      <div className="flex p-3 items-center">
        <div className="flex items-center gap-1">
          {/* left part */}
          {
            lecture.lectureAssets?.type === 'VIDEO' ?
              <img src={lecture.lectureAssets?.thumbnailUrl ? lecture.lectureAssets?.thumbnailUrl : undefined} alt="PDF"
                className="h-[60px] w-[110px] border border-gray-400"
              /> :
              <Card className="w-[110px] h-[60px] rounded-none flex justify-center items-center">
                <span className="text-center">PDF</span>
              </Card>
          }
          <div className="flex-col justify-center ml-2 items-center">
            {/* contents right of image */}
            <p className="font-semibold">{lecture.lectureAssets?.title}</p>
            <p >duration : {
              lecture.lengthNum! < 60 ? <>
                {lecture.lengthNum} secs
              </>
                :
                <>
                  {lecture.lengthNum! / 3600} hrs
                </>
            }</p>
            <div className="flex gap-2 items-center cursor-pointer" onClick={handleClick_EditContent}>
              <Edit2 strokeWidth={1} className="text-purple-700" size={17} />
              <p className="text-purple-700">Edit Content</p>
            </div>
          </div>
        </div>
        <div className=" ml-auto">
          {/* right part */}
          {/* lecture.lectureAssets.url */}
          <Button className="bg-purple-600 hover:bg-purple-600 cursor-pointer text-white rounded-sm w-30"
            onClick={() => window.open(lecture?.lectureAssets?.url, "_blank")}
          > Preview </Button>
        </div>
      </div>
    </div>
  )
}

export default Content
