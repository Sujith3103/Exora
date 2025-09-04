import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, ChevronDown, ChevronUp, CircleCheck, Edit2, FileTextIcon, PlayCircleIcon, Plus, Trash2Icon, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Content from '../content/index'
import NewContent from '../content/new-content'
import { Checkbox } from '@/components/ui/checkbox'
import { deleteLecture, updateLectureTitle, type Lectures } from '@/store/courseSlice'
import { Input } from '@/components/ui/input'
import server from '@/api/axiosinstance'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import ResourceComponent from '../resource'
import NewResource from '../resource/new-resource'


type LectureProp = {
    lecture: Lectures,
    index: number,

}

type ShowContent = {
    uploadingContent: boolean,
    selectingContent: boolean,
    LectureId: string | null
}

type ShowResource = {
    showRecourse: boolean
    uploadRecourse: boolean
    lecture: Lectures | null
}

const Lecture = ({ lecture, index }: LectureProp) => {

    const dispatch = useDispatch<AppDispatch>()

    const [showSubContent, setShowSubContent] = useState(false)
    const [isEditLectureTitle, setIsEditLectureTitle] = useState(false)
    const [isloading, setIsloading] = useState(false)
    const [isFailedAsset, setisFailedAsset] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const [showContent, setShowContent] = useState<ShowContent>({
        uploadingContent: false,
        selectingContent: false,
        LectureId: null
    })

    const [ShowResource, setShowResource] = useState<ShowResource>({
        showRecourse: false,
        uploadRecourse: false,
        lecture: null
    })

    async function handleClick_EditTitle() {
        setIsloading(true)
        try {
            const title = inputRef.current?.value
            const response = await server.patch(`/instructor/course/${lecture.sectionId}/lectures/${lecture.id}/title`, { title })
            inputRef.current = null

            if (response.data.success) {
                dispatch(updateLectureTitle({ lectureId: lecture.id, sectionId: lecture.sectionId, title: response.data.lecture.title }))
            }
            setIsEditLectureTitle(false)
        } catch (err) {
            console.log(err)

        }
        setIsloading(false)
    }

    async function handleClick_DeleteLecture() {
        setIsloading(true)
        try {

            const response = await server.delete(`/instructor/course/${lecture.sectionId}/lectures/${lecture.id}`)

            if (response.data.success) {
                dispatch(deleteLecture(lecture))
            }

        } catch (err) {
            console.log(err)
        }
        setIsloading(false)
    }

    const handleClick_SetShowContent = () => {
        if (lecture.lectureAssets?.status === 'failed') {
            setisFailedAsset(prev => !prev)

        }
        else {
            setShowContent(prev => ({
                ...prev,
                LectureId: lecture.id,
                selectingContent: !prev.selectingContent,
                uploadingContent: false,
            }))
        }
    }

    useEffect(() => {
        if (lecture.lectureAssets?.status === 'failed') {
            setisFailedAsset(true)
        }
    }, [])
    useEffect(() => {

    })

    return (
        <div className={isloading ? "cursor-progress pointer-events-none" : ""}>
            <Card
                key={lecture.id || index}
                className={`flex flex-col min-h-fit mt-0 mb-0 pt-0 pb-0 rounded-none p-3 gap-0 border-gray-200 shadow-md min-w-fit 
                ${isloading ? 'cursor-progress' : ''}`}
            >
                <div className="flex flex-row items-center gap-2 group">
                    <CircleCheck size={15} strokeWidth={1} />
                    <p className="whitespace-nowrap">Lecture {index + 1}:</p>

                    <div className="flex items-center gap-1 ml-4 w-full">
                        {
                            lecture.lectureAssets?.type === 'VIDEO' ?
                                <>
                                    <PlayCircleIcon size={15} strokeWidth={1} />
                                </> :

                                <FileTextIcon size={15} strokeWidth={1} />
                        }
                        {
                            isEditLectureTitle ? (
                                <>
                                    <Input className='ml-2 w-full' ref={inputRef} defaultValue={lecture.title} placeholder='Enter your lecture title' />
                                </>
                            ) : (
                                <>
                                    <p className="whitespace-nowrap">{lecture.title}</p>
                                </>
                            )

                        }
                        <div className="flex gap-1 items-center opacity-0 group-hover:opacity-100">
                            {
                                !isEditLectureTitle ?
                                    <>
                                        <Edit2 size={13}
                                            className=' transition-transform duration-200 ml-2 transform hover:scale-120  cursor-pointer'
                                            onClick={() => setIsEditLectureTitle(true)}
                                        />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Trash2Icon size={15} strokeWidth={1}
                                                    className="text-red-700 transition-transform duration-200 transform hover:scale-120  cursor-pointer"
                                                />
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your
                                                        lecture and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleClick_DeleteLecture}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                    </>
                                    :
                                    <>
                                        <X size={20} strokeWidth={1} className=' transition-transform duration-200 transform hover:scale-120  cursor-pointer'
                                            onClick={() => setIsEditLectureTitle(false)} />
                                        <Check size={20} strokeWidth={1} className=' transition-transform duration-200 transform hover:scale-120  cursor-pointer'
                                            onClick={handleClick_EditTitle} />
                                    </>
                            }
                        </div>
                    </div>
                    {
                        lecture.lectureAssets?.status != 'published' &&

                        <div className='ml-auto flex items-center gap-2'>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    handleClick_SetShowContent()
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
                                        // return (
                                        //     <>
                                        //         <Plus /> Content
                                        //     </>
                                        // )
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
                        lecture.lectureAssets?.status === 'published' &&
                        <>
                            {showSubContent ? (
                                <div className='flex ml-auto transition-all duration-300 items-center'>

                                    {
                                        lecture.lectureAssets.status === 'published' && showSubContent && showContent.selectingContent && <>
                                            <Button className='bg-purple-600 w-30 transition-all duration-300 rounded-sm hover:bg-purple-500 cursor-pointer'
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
                        <NewContent sectionId={lecture.sectionId} setShowContent={setShowContent} showContent={showContent} lectureData={lecture} lectureId={lecture.id} setShowSubContent={setShowSubContent} />
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
                    {
                        lecture.lectureAssets?.status === 'failed' && <NewContent isfailed={isFailedAsset} sectionId={lecture.sectionId} setShowContent={setShowContent} showContent={showContent} lectureData={lecture} lectureId={lecture.id} setShowSubContent={setShowSubContent} />
                    }
                    {ShowResource.uploadRecourse && <NewResource lecture={lecture} setShowResource={setShowResource} />}

                    {lecture.Resource && lecture.Resource?.length > 0 && <ResourceComponent lecture={lecture} />}
                    <>                    </>
                    {
                        !ShowResource.uploadRecourse &&
                        <Card className="p-2 flex flex-row items-center justify-center rounded-none gap-30 border-2 border-dotted border-gray-300">
                            <Button className=" w-35 gap-1 text-purple-600 border bg-white border-purple-500 rounded-sm hover:bg-purple-100 transition-all duration-300"
                                onClick={() => setShowResource(prev => ({
                                    ...prev,
                                    uploadRecourse: true
                                }))}
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
                    }
                </div>
                {/* Extra card immediately below the button */}

            </Card >
        </div >
    )
}

export default Lecture
