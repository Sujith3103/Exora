import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowDown, ChevronDown, ChevronUp, CircleCheck, FileTextIcon, Plus } from 'lucide-react'
import React, { useState } from 'react'
import Content from '../content/new-content'
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
    lectureAsset?: LectureAsset
    resources?: Resources[]
}

type AddingContentState = {
    LectureId: string | null;   
    addingContent: boolean;
};

type LectureProp = {
    lecture: Lectures,
    index: number,

}

const Lecture = ({ lecture, index }: LectureProp) => {

    const [isAddingContent, setIsAddingContent] = useState<AddingContentState>({
        LectureId: null,
        addingContent: false
    })
    const [showSubContent, setShowSubContent] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    return (
        <div>
            <Card
                key={lecture.id || index}
                className="flex flex-col mt-0 mb-0 pt-0 pb-0 rounded-none p-3 gap-0 "
            >
                <div className="flex flex-row items-center gap-2">
                    <CircleCheck size={15} strokeWidth={1} />
                    <p className="whitespace-nowrap">Lecture {lecture.order}:</p>

                    <div className="flex items-center gap-1 ml-4">
                        <FileTextIcon size={15} strokeWidth={1} />
                        <p className="whitespace-nowrap">{lecture.title}</p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() =>
                            setIsAddingContent(prev => ({
                                addingContent: prev.LectureId === lecture.id ? !prev.addingContent : true,
                                LectureId: lecture.id,
                            }))
                        }
                        className="flex items-center justify-center ml-auto rounded-none text-purple-600 border-purple-500 hover:bg-purple-100 w-35 relative overflow-hidden h-9"
                    >
                        {/* Cancel text */}
                        <span
                            className={`absolute left-0 right-0 hover:text-purple-500 top-0 flex items-center justify-center w-full h-full transition-all duration-300 ${isAddingContent.addingContent && isAddingContent.LectureId === lecture.id && isUploading
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-2"
                                }`}
                        >
                            Show Content  <ChevronUp
                                strokeWidth={1}
                                className="cursor-pointer ml-1"
                                onClick={() => setShowSubContent(false)}
                            />
                        </span>
                        <span
                            className={`absolute left-0 right-0 top-0 flex items-center justify-center w-full h-full transition-all duration-300 ${isAddingContent.addingContent && isAddingContent.LectureId === lecture.id && !isUploading
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-2"
                                }`}
                        >
                            × Cancel
                        </span>
                        {/* Plus Content text */}
                        <span
                            className={`absolute left-0 right-0 top-0 flex items-center justify-center w-full h-full transition-all duration-300 ${isAddingContent.addingContent && isAddingContent.LectureId === lecture.id
                                ? "opacity-0 translate-y-2"
                                : "opacity-100 translate-y-0"
                                }`}
                        >
                            <Plus /> Content
                        </span>
                    </Button>
                    {/* Toggle Icons */}
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
                {
                    isAddingContent.addingContent && lecture.id === isAddingContent.LectureId && (
                        <NewContent lectureData={lecture} lectureId={lecture.id} isUploading={isUploading} setIsUploading={setIsUploading} />
                    )
                }
                <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${showSubContent ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                        }`}
                >
                    {
                        lecture.lectureAsset?.status === 'published' &&
                        <>
                            <p>hi</p>
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
