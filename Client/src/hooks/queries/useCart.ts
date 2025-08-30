import server from "@/api/axiosinstance"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useCart = (id: string) => {

    return useQuery({
        queryKey: ['cart', id],
        queryFn: async () => {
            const res: any = server.get(`/user/cart/${id}`)
            return res.data
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60
    })

}