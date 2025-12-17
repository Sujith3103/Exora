import server from "@/api/axiosinstance"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const usePopularCourses = () => {

    return useQuery({
        queryKey: ['courses', 'popular'],
        queryFn: async () => {
            const res = await server.get(`/courses/popular`)
            return res.data
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        placeholderData:keepPreviousData
    })
    
}       