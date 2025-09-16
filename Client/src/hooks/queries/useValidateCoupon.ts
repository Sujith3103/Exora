import server from "@/api/axiosinstance";
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { toast } from "sonner";

type validateCouponProps = {
    courseId: string,
    instructorId: string,
    coupon: string,
    isAuthenticated: boolean,
    userId: string,
}

export const useValidateCoupon = ({ courseId, instructorId, coupon, isAuthenticated, userId }: validateCouponProps, enabled: boolean) => {
    return useQuery({
        queryKey: ['validate-coupon', instructorId, coupon],
        queryFn: async () => {
            console.log("validage coupon : ",coupon)
            toast.loading('validating coupon', { style: { justifyContent: 'center' } })
            const res = await server.post(`/validate/coupon`, {
                courseId: courseId,
                instructorId: instructorId,
                coupon: coupon,
                isAuthenticated,
                userId,
            });
            console.log("RES:", res)
            return res
        },
        placeholderData: keepPreviousData,
        enabled,
        staleTime: Infinity,
        refetchOnWindowFocus: false,

    })
}