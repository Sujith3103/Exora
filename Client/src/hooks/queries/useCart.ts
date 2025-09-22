import server from "@/api/axiosinstance"
import type { RootState } from "@/store"
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"

export const useCart = () => {

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            if (isAuthenticated) {
                const res: any = await server.get(`/user/cart`)
                return res.data
            }
            return ''
        },
        staleTime: Infinity,
        enabled:false
    })

}
