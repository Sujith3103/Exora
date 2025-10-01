import server from "@/api/axiosinstance"
import { useQuery } from "@tanstack/react-query"

export const useCourseMessage = (id: string) => {

    return useQuery({
        queryKey: ['course-message', id],
        queryFn: async () => {

            const res = await server.get(`/courses/${id}/message`)
            console.log(res.data)
            return res.data

        },
        
    })
}