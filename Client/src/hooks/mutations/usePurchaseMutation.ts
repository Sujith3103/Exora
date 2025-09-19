import server from "@/api/axiosinstance"
import { useMutation } from "@tanstack/react-query"

type PurchaseMutationProps = {

    discountApplied: number,
    finalPrice: number,
    originalPrice: number,
    courseId: string

}

const usePurchaseMutation = () => {


    const purchaseCourse = useMutation({
        mutationFn: async ({ courseId, discountApplied, finalPrice, originalPrice }: PurchaseMutationProps) => {
            const res = await server.post(`/courses/${courseId}/purchase`,{
                discountApplied,
                finalPrice,
                originalPrice
            })
            return res.data
        }
    })

    return {purchaseCourse}

}   

export default usePurchaseMutation