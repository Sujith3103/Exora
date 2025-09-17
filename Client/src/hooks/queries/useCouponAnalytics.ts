import server from "@/api/axiosinstance"
import type { couponAnalyticsType } from "@/components/instructor-view/coupons/coupon-analytics/couponAnalytics"
import type { RootState } from "@/store"
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"


export const useCouponAnalytics = () => {

    const user = useSelector((state: RootState) => state.auth.user)

    return useQuery<couponAnalyticsType>({
        queryKey: ['coupon-analytics', user?.id],
        queryFn: async () => {
            const res = await server.get(`/instructor/coupon/analytics`)
            if (res.data) {
                return res.data.data
            }
        },
        staleTime:1000 * 60 * 5,
        enabled: !!user?.id
    })
}