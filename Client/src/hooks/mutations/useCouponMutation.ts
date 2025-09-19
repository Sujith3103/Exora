import server from "@/api/axiosinstance"
import type { couponForm } from "@/components/instructor-view/coupons/new-coupon/newCoupon"
import type { Coupon } from "@/config/config"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"

type validateCouponProps = {
    courseId: string,
    instructorId: string,
    coupon: string,
    isAuthenticated: boolean,
    userId: string,
}
type validateCouponOnLoginProps = {
    courseId: string,
    instructorId: string,
    isAuthenticated?: boolean,
    userId: string,
}

const useCouponMutation = () => {

    const queryClient = useQueryClient()

    const addNewCoupon = useMutation({
        mutationFn: async (coupon: couponForm) => {
            const res = await server.post('/instructor/coupon', coupon)
            return res.data
        },
        onMutate: async (coupon) => {
            toast.loading('creating new coupon', { style: { justifyContent: 'center' } })
            await queryClient.cancelQueries({ queryKey: ['coupons'] })

            const previousCoupons = queryClient.getQueryData(['coupons'])

            queryClient.setQueryData(['coupons'], (old: any) => {
                return [...(old || []), { ...coupon, id: 'temp-id' }]
            })

            return { previousCoupons }

        },
        onError: (_err, _newCoupon, context) => {
            toast.dismiss()
            toast.error('Failed to create new coupon', { style: { justifyContent: 'center' }, duration: 1000 })
            queryClient.setQueryData(['coupons'], context?.previousCoupons)
        },
        onSuccess: () => {
            toast.dismiss()
            toast.success('Created a new coupon', { style: { justifyContent: 'center' } })
        },
        onSettled: () => {
            // Ensure data is in sync
            toast.dismiss()
            queryClient.invalidateQueries({ queryKey: ['coupons'] })
        }
    })

    const editCoupon = useMutation({
        mutationFn: async (coupon: couponForm) => {
            const res = await server.put(`/instructor/coupon/${coupon.id}`, coupon);
            return res.data
        },
        onMutate: async (coupon) => {
            toast.loading('Updating coupon', { style: { justifyContent: 'center' } })
            await queryClient.cancelQueries({ queryKey: ["coupons"] });

            const previousCoupons = queryClient.getQueryData<Coupon[]>(["coupons"]);

            queryClient.setQueryData(["coupons"], (old: Coupon[] = []) =>
                old.map((c) =>
                    c.id === coupon.id
                        ? { ...c, ...coupon }
                        : c
                )
            );
            return { previousCoupons };
        },

        onError: (_err, _newCoupon, context) => {
            toast.dismiss()
            toast.error('Failed to create new coupon', { style: { justifyContent: 'center' }, duration: 1000 })
            if (context?.previousCoupons) {
                queryClient.setQueryData(["coupons"], context.previousCoupons);
            }
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
        },

        onSuccess: () => {
            toast.dismiss()
            toast.success('Updated coupon', { style: { justifyContent: 'center' }, duration: 1000 })
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
        },

    });

    const deleteCoupon = useMutation({
        mutationFn: async (coupon: couponForm) => {
            const res = await server.delete(`/instructor/coupon/${coupon.id}`)
            return res.data
        },

        onMutate: async (coupon) => {
            await queryClient.cancelQueries({ queryKey: ['coupons'] })

            const previousCoupons = queryClient.getQueryData(['coupons'])

            queryClient.setQueryData(['coupons'], (old: Coupon[] = []) => {
                return old.filter(c => c.id !== coupon.id)
            })
            toast.loading('Deleting coupon', { style: { justifyContent: 'center' } })

            return { previousCoupons }
        },
        onError: (_err, _newcoupon, context) => {
            toast.dismiss()
            toast.error('Failed to delete a coupon', { style: { justifyContent: 'center' }, duration: 1000 })

            if (context?.previousCoupons) {
                queryClient.setQueryData(['coupons'], context.previousCoupons)
            }
        },

        onSuccess: () => {
            toast.dismiss()
            toast.success('Deleted coupon', { style: { justifyContent: 'center' }, duration: 1000 })
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] })
        }
    })

    const validateCoupon = useMutation({
        mutationFn: async ({ coupon, courseId, instructorId, isAuthenticated, userId }: validateCouponProps) => {
            const res = await server.post(`/validate/coupon`, {
                courseId: courseId,
                instructorId: instructorId,
                coupon: coupon,
                isAuthenticated: isAuthenticated,
                userId,
            });
            return res.data
        },
        onMutate: () => {
            toast.loading('validating coupon', { style: { justifyContent: 'center' } })
        },

        onError: () => {
            toast.dismiss()
            toast.error("Failed to apply coupon", { style: { justifyContent: 'center' }, duration: 2000 });
        },
    })

    const validateCouponOnLogin = useMutation({
        mutationFn: async ({ courseId, instructorId, userId, isAuthenticated }: validateCouponOnLoginProps) => {
            const res = await server.post('/validate/coupon/on-login', {
                courseId: courseId,
                instructorId: instructorId,
                userId: userId,
                isAuthenticated: isAuthenticated
            })
            return res.data
        },
        
    })

    return { addNewCoupon, editCoupon, deleteCoupon, validateCoupon,validateCouponOnLogin }

}

export default useCouponMutation