import server from "@/api/axiosinstance"
import { keepPreviousData, useQuery } from "@tanstack/react-query"


export const useCourseDetails = (id: string) => {

    return useQuery({
        queryKey: ["course", id],
        queryFn: async () =>{ 
            const res = await server.get(`/courses/${id}`)
            return res.data  
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 120
    })
}   