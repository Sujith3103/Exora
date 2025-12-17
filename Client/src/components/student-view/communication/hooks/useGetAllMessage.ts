import server from "@/api/axiosinstance"
import { useQuery } from "@tanstack/react-query"

// type GetALlMessagesProps = {

//     userId: string

// }

export const useGetAllMessage = () => {

    return useQuery({
        queryKey: ['messages'],
        queryFn: async () => {
            const res = await server.get(`/communication/messages`)
            return res.data
        },
        staleTime: Infinity,
        refetchOnWindowFocus: true,
    })
}