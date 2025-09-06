import server from "@/api/axiosinstance"
import type { couponForm } from "@/components/instructor-view/coupons/new-coupon/newCoupon"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { toast } from "sonner"


// {
//     "success": true,
//     "message": "created a coupon successfully",
//     "data": {
//         "id": "990b0276-f851-42a2-b8ac-aa47966ba9f1",
//         "title": "first coupon",
//         "code": "FIRST50",
//         "discountType": "percentage",
//         "discount": 50,
//         "noOfCoupons": 50,
//         "limitPerUser": 1,
//         "onlyFor": "tier_3",
//         "autoApply": true,
//         "totalRevenue": 0,
//         "courseId": "",
//         "applyTo": "allCourses",
//         "validUntil": "2025-09-07T13:39:00.000Z",
//         "validFrom": "2025-09-06T13:44:10.301Z",
//         "userId": "4ab40594-8e14-4a60-9c68-2797c4a8e66a"
//     }
// }
const useCouponMutation = () => {

    const queryClient = useQueryClient()
    const dispatch = useDispatch()

    const addNewCoupon = useMutation({
        mutationFn: async (coupon: couponForm) => {
            const res = await server.post('/instructor/coupon', coupon)
            return res.data
        },
        onMutate: async (coupon) => {

            await queryClient.cancelQueries({ queryKey: ['coupon'] })

            const previousCoupons = queryClient.getQueryData(['coupon'])

            queryClient.setQueryData(['coupons'], (old: any) => {
                return [...(old || []), { ...coupon, id: 'temp-id' }]
            })

            return {previousCoupons}
            
        }
    })

    return { addNewCoupon }

}

export default useCouponMutation