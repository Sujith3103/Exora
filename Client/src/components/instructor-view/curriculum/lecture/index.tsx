import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {  ChevronDown, ChevronUp, CircleCheck, FileTextIcon, PlayCircleIcon, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import Content from '../content/index'
import NewContent from '../content/new-content'
import { Checkbox } from '@/components/ui/checkbox'
import type { LectureAsset, Resources } from '@/store/courseSlice'

interface Lectures {
    id: string,
    sectionId: string,
    title: string,
    videoUrl: string,   // URL to CDN (Cloudinary, S3, etc.)
    freePreview: boolean,
    lengthNum?: number,    // length in seconds
    lengthStr?: string,// e.g. "12:34"
    order: number
    lectureAssets?: LectureAsset
    resources?: Resources[]
}

type LectureProp = {
    lecture: Lectures,
    index: number,

}

type ShowContent = {
    uploadingContent: boolean,
    selectingContent: boolean,
    LectureId: string | null
}

const Lecture = ({ lecture, index }: LectureProp) => {
    const [showSubContent, setShowSubContent] = useState(false)
    const [showContent, setShowContent] = useState<ShowContent>({
        uploadingContent: false,
        selectingContent: false,
        LectureId: null
    })

    useEffect(() => {
        console.log("show ontent :", showContent)
    }, [showContent])

    return (
        <div>
            <Card
                key={lecture.id || index}
                className="flex flex-col min-h-fit mt-0 mb-0 pt-0 pb-0 rounded-none p-3 gap-0 border-gray-200 shadow-md  "
            >
                <div className="flex flex-row items-center gap-2">
                    <CircleCheck size={15} strokeWidth={1} />
                    <p className="whitespace-nowrap">Lecture {lecture.order}:</p>

                    <div className="flex items-center gap-1 ml-4">
                        {
                            lecture.lectureAssets?.type === 'VIDEO' ?
                                <>
                                    <PlayCircleIcon size={15} strokeWidth={1} />
                                </> :

                                <FileTextIcon size={15} strokeWidth={1} />
                        }
                        <p className="whitespace-nowrap">{lecture.title}</p>
                    </div>
                    {
                        !lecture.lectureAssets?.status &&

                        <div className='ml-auto flex items-center gap-2'>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setShowContent(prev => ({
                                        ...prev,
                                        LectureId: lecture.id,
                                        selectingContent: !prev.selectingContent,
                                        uploadingContent: false,
                                    }))
                                }
                                className="flex items-center justify-center ml-auto rounded-none text-purple-600 border-purple-500 hover:bg-purple-100 w-35 h-9"
                            >
                                {(() => {
                                    if (showContent.LectureId === lecture.id) {
                                        if (showContent.selectingContent) {
                                            return (
                                                <>
                                                    × Cancel
                                                </>
                                            )
                                        }
                                        return (
                                            <>
                                                <Plus /> Content
                                            </>
                                        )
                                    }
                                    return (
                                        <>
                                            <Plus /> Content
                                        </>
                                    )
                                })()}
                            </Button>

                            {showSubContent ? (
                                <ChevronUp
                                    strokeWidth={1}
                                    className="cursor-pointer"
                                    onClick={() => setShowSubContent(false)}
                                />
                            ) : (
                                <ChevronDown
                                    strokeWidth={1}
                                    className="cursor-pointer"
                                    onClick={() => setShowSubContent(true)}
                                />
                            )}
                        </div>


                    }
                    {
                        lecture.lectureAssets?.status &&
                        <>
                            {showSubContent ? (
                                <div className='flex ml-auto transition-all duration-300 items-center'>

                                    {
                                        lecture.lectureAssets.status === 'published' && showSubContent && showContent.selectingContent && <>
                                            <Button className='bg-purple-500 w-30 transition-all duration-300 rounded-sm hover:bg-purple-400 cursor-pointer'
                                                onClick={() => setShowContent(prev => ({
                                                    ...prev,
                                                    selectingContent: false
                                                }))}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    }
                                    <ChevronUp
                                        strokeWidth={1}
                                        className="cursor-pointer ml-auto transition-all duration-300"
                                        onClick={() => setShowSubContent(false)}
                                    />
                                </div>
                            ) : (
                                <ChevronDown
                                    strokeWidth={1}
                                    className="cursor-pointer ml-auto"
                                    onClick={() => setShowSubContent(true)}
                                />
                            )}
                        </>
                    }
                    {/* Toggle Icons */}

                </div>
                {
                    (showContent.selectingContent || showContent.uploadingContent) && lecture.id === showContent.LectureId && (
                        <NewContent setShowContent={setShowContent} showContent={showContent} lectureData={lecture} lectureId={lecture.id} setShowSubContent={setShowSubContent} />
                    )
                }
                <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${showSubContent ? "opacity-100 mt-2 h-auto" : "opacity-0 h-0 mt-0"}`}
                >
                    {
                        lecture.lectureAssets?.status === 'published' && !showContent.selectingContent && !showContent.uploadingContent &&
                        <>
                            <Content setShowContent={setShowContent} showContent={showContent} lecture={lecture} setShowSubContent={setShowSubContent} />
                        </>
                    }
                    <Card className="p-2 flex flex-row items-center justify-center rounded-none gap-30 border-2 border-dotted border-gray-300">
                        <Button className=" w-35 gap-1 text-purple-600 border bg-white border-purple-500 rounded-sm hover:bg-purple-100 transition-all duration-300"

                        >
                            <Plus />
                            Resources
                        </Button>
                        <Button
                            asChild
                            className="flex items-center gap-2 text-purple-600 border bg-white border-purple-500 rounded-sm hover:bg-purple-100 transition-all duration-300"
                        >
                            <div>
                                Free Preview
                                <Checkbox
                                    className="ml-2 border-purple-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                />
                            </div>
                        </Button>

                    </Card>
                </div>
                {/* Extra card immediately below the button */}

            </Card >
        </div >
    )
}

export default Lecture
