
import server from "@/api/axiosinstance"
import { useQuery } from "@tanstack/react-query"

// type GetALlMessagesProps = {

//     userId: string

// }

export const useGetMessageById = (messageId: string) => {

    return useQuery({
        queryKey: ['message', messageId],
        queryFn: async () => {

            const res = await server.get(`/communication/messages/${messageId}`)
            return res.data

        },
        refetchOnWindowFocus: true,

    })
}