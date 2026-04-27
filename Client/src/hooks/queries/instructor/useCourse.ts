import server from "@/api/axiosinstance"
import { useQuery } from "@tanstack/react-query"

type Prop = {
    courseId: string
}

export const useInstructorCourse = ({ courseId }: Prop) => {

    return useQuery({
        queryKey: ['course',courseId],
        queryFn: async () => {
            const res = await server.get(`/instructor/course/${courseId}/landing`)
            return res.data.course
        },
        staleTime: Infinity,
        // enabled: false
    })
}