import server from "@/api/axiosinstance"
import { useQuery } from "@tanstack/react-query"

export const useCart = () => {

    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const res: any = await server.get(`/user/cart`)
            return res.data
        },
        staleTime: Infinity
    })

}
