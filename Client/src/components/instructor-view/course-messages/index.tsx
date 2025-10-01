import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useRef } from "react"
import { useParams } from "react-router-dom"
import { useCourseMessageMutation } from "./hooks/mutation/useCourseMessageMutation"
import { toast } from "sonner"
import { useCourseMessage } from "./hooks/useCourseMessage"
import { Skeleton } from "@/components/ui/skeleton"

const CourseMessage = () => {

    const { id } = useParams()

    const welcomeMessageRef = useRef<HTMLTextAreaElement>(null)
    const congratulationsMessageRef = useRef<HTMLTextAreaElement>(null)

    const { saveMessages } = useCourseMessageMutation()

    const { data: courseMessage, isLoading, isError } = useCourseMessage(id!)

    const handleSave = () => {
        const welcomeMessage = welcomeMessageRef.current?.value || ""
        const congratulationsMessage = congratulationsMessageRef.current?.value || ""

        if (!welcomeMessage && !congratulationsMessage) {
            toast.error('Cant save both as empty', { style: { justifyContent: 'center' }, duration: 2000 })
            return
        }

        if (!id) return

        saveMessages.mutate({ courseId: id, congradulationsMessage: congratulationsMessage, welcomeMessage: welcomeMessage },

        )
    }

    return (
        <div className="lg:px-30 md:px-10 mt-5">
            <Card className="rounded-none h-[80%]">
                <div className="flex items-center">
                    <p className="text-2xl font-bold font-serif px-10">Course Messages</p>
                    <Button className="ml-auto mr-5" onClick={handleSave}>
                        Save Messages
                    </Button>
                </div>
                <hr />

                <div className="px-10 flex flex-col">
                    <p className="font-thin">
                        Write messages to your students (optional) that will be sent automatically
                        when they join or complete your course to encourage them to engage with content.
                        Leave blank if you do not want to send these messages.
                    </p>

                    <label className="mt-7 mb-2 font-medium">Welcome Message</label>
                    {
                        isLoading ? (
                            <>
                                <Card
                                    className="min-h-[120px] max-h-[200px] resize-y mt-2 w-full items-center"
                                >

                                    <Skeleton className="w-200 h-5" />
                                    <Skeleton className="w-200 h-5" />
                                </Card>
                            </>
                        ) : (
                            <Textarea
                                ref={welcomeMessageRef}
                                defaultValue={courseMessage?.data.welcomeMessage}
                                placeholder="Write a welcome message..."
                                className="min-h-[120px] max-h-[200px] resize-y mt-2 w-full"
                            />)
                    }

                    <label className="mt-7 mb-2 font-medium">Congratulations Message</label>
                    {
                        isLoading ? (
                            <>
                                <Card
                                    className="min-h-[120px] max-h-[200px] resize-y mt-2 w-full items-center"
                                >

                                    <Skeleton className="w-200 h-5" />
                                    <Skeleton className="w-200 h-5" />
                                </Card>
                            </>
                        ) : (
                            <Textarea
                                ref={congratulationsMessageRef}
                                defaultValue={courseMessage?.data.congradulationsMessage}
                                placeholder="Write a congratulations message..."
                                className="min-h-[120px] max-h-[200px] resize-y mt-2 w-full"
                            />
                        )
                    }
                </div>
            </Card>
        </div>
    )
}

export default CourseMessage
