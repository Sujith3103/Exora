import server from "@/api/axiosinstance"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useCourseTitles = () => {

    return useQuery({
        queryKey: ['courses', 'titles'],
        queryFn: async () => {
            const res = await server.get(`/instructor/course/titles`)
            return res.data.data
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        placeholderData:keepPreviousData
    })
    
}