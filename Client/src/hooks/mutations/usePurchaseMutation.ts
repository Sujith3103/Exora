import server from "@/api/axiosinstance"
import type { ClickEvent } from "@/config/config"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

type PurchaseMutationProps = {

    discountApplied: number,
    finalPrice: number,
    originalPrice: number,
    courseId: string,
    userId: string,
    categoryId: string,
    instructorId: string,
    coupon: {} | null

}

const usePurchaseMutation = () => {


    const purchaseCourse = useMutation({
        mutationFn: async ({
            courseId,
            discountApplied,
            finalPrice,
            originalPrice,
            userId,
            categoryId,
            instructorId,
            coupon,
        }: PurchaseMutationProps) => {
            const clickEvent: ClickEvent = {
                type: "course",
                action: "enroll",
                userId,
                targetId: courseId,
                categoryId,
                instructorId,
            };

            const res = await server.post(`/courses/${courseId}/purchase`, {
                discountApplied,
                finalPrice,
                originalPrice,
                clickEvent,
                coupon,
            });

            return res.data; // { success: true/false, message, ... }
        },
        onMutate: () => {
            toast.loading(`Purchasing the course...`, { style: { justifyContent: "center" } });
        },
        onSettled: (data: any) => {
            toast.dismiss();
            if (data?.success) {
                toast.success(data.message || "Course purchased successfully", {
                    style: { justifyContent: "center" },
                });
            } else {
                toast.error(data?.message || "Failed to purchase the course", {
                    style: { justifyContent: "center" },
                });
            }
        },
    });

    return { purchaseCourse }

}

export default usePurchaseMutation