import server from "@/api/axiosinstance"
import type { Coupon } from "@/config/config"
import { useQuery } from "@tanstack/react-query"

export const useCoupon = () => {

    return useQuery({
        queryKey: ['coupons'],
        queryFn: async () => {
            const res = await server.get('/instructor/coupon')
            return res.data.data as Coupon[]
        },
        staleTime:1000 * 60 * 5
    })
}