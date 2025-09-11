import server from "@/api/axiosinstance"
import type { couponForm } from "@/components/instructor-view/coupons/new-coupon/newCoupon"
import type { Coupon } from "@/config/config"
import { useQuery } from "@tanstack/react-query"

export const useCoupon = () => {

    return useQuery({
        queryKey: ['coupon'],
        queryFn: async () => {
            const res = await server.get('/instructor/coupon')
            return res.data.data as Coupon[]
        },
        staleTime:1000 * 60 * 5
    })
}