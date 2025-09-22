import server from "@/api/axiosinstance"
import type { ClickEvent, Coupon } from "@/config/config"
import { useMutation } from "@tanstack/react-query"

type PurchaseMutationProps = {

    discountApplied: number,
    finalPrice: number,
    originalPrice: number,
    courseId: string,
    userId: string,
    categoryId: string,
    instructorId: string,
    coupon: {}

}

const usePurchaseMutation = () => {


    const purchaseCourse = useMutation({
        mutationFn: async ({ courseId, discountApplied, finalPrice, originalPrice, userId, categoryId, instructorId,coupon }: PurchaseMutationProps) => {
            const clickEvent: ClickEvent = {
                type: "course",
                action: 'enroll',
                userId,
                targetId: courseId,
                categoryId,
                instructorId
            }
            const res = await server.post(`/courses/${courseId}/purchase`, {
                discountApplied,
                finalPrice,
                originalPrice,
                clickEvent,
                coupon
            })
            return res.data
        }
    })

    return { purchaseCourse }

}

export default usePurchaseMutation