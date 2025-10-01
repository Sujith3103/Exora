import server from "@/api/axiosinstance"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

type CourseMessageMutationProps = {

    welcomeMessage: string,
    congradulationsMessage: string
    courseId: string
}

export const useCourseMessageMutation = () => {


    const saveMessages = useMutation({

        mutationFn: async ({ congradulationsMessage, welcomeMessage, courseId }: CourseMessageMutationProps) => {

            const res = await server.put(`/courses/${courseId}/message`, {
                welcomeMessage, congradulationsMessage
            })
            return res.data
        },

        onMutate: () => {
            toast.loading('updating course message', { style: { justifyContent: 'center' } })
        },

        onSettled: (data) => {
            if (data.success) {
                toast.dismiss()
                toast.success('course message updated successfully', { style: { justifyContent: 'center' }, duration: 2000 })
            } else {
                toast.dismiss()
                toast.error('failed to update course message', { style: { justifyContent: 'center' }, duration: 2000 })
            }
            
        }

    })

    return { saveMessages }

}