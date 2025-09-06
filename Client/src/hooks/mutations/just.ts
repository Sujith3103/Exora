import server from "@/api/axiosinstance"
import type { couponForm } from "@/components/instructor-view/coupons/new-coupon/newCoupon"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const queryClient = useQueryClient()

const addNewCoupon = useMutation({
  mutationFn: async (coupon: couponForm) => {
    const res = await server.post('/instructor/coupon', coupon)
    return res.data
  },
  onMutate: async (newCoupon) => {
    // Cancel ongoing fetches for coupons
    await queryClient.cancelQueries({ queryKey: ['coupons'] })

    // Snapshot previous value
    const previousCoupons = queryClient.getQueryData(['coupons'])

    // Optimistically update
    queryClient.setQueryData(['coupons'], (old: any) => {
      return [...(old || []), { ...newCoupon, id: 'temp-id' }]
    })

    return { previousCoupons }
  },
  onError: (_err, _newCoupon, context) => {
    // Rollback if error
    queryClient.setQueryData(['coupons'], context?.previousCoupons)
  },
  onSettled: () => {
    // Ensure data is in sync
    queryClient.invalidateQueries({ queryKey: ['coupons'] })
  }
})
