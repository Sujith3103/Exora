import server from "@/api/axiosinstance"
import {  useQuery } from "@tanstack/react-query"

export const useCart = (id: string) => {

    return useQuery({
        queryKey: ['cart', id],
        queryFn: async () => {
            const res: any = await server.get(`/user/cart/${id}`)
            return res.data
        },
        refetchOnMount:true
    })

}