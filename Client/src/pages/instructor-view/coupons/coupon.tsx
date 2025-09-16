import CouponsList from "@/components/instructor-view/coupons/coupons-list/couponsList"
import NewCoupon from "@/components/instructor-view/coupons/new-coupon/newCoupon"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Coupon } from "@/config/config"
import { useCoupon } from "@/hooks/queries/useCoupon"
import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react"

const CouponPage = () => {

    const { data: coupons, isLoading, error } = useCoupon()
    const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([])
    const [scheduledCoupons, setScheduledCoupons] = useState<Coupon[]>([])


    useEffect(() => {
        if (!coupons) return

        const now = new Date()

        const active: Coupon[] = []
        const scheduled: Coupon[] = []

        coupons.forEach(coupon => {
            if (new Date(coupon.validFrom ?? 0) <= now) {
                active.push(coupon)
            } else {
                scheduled.push(coupon)
            }
        })

        setActiveCoupons(active)
        setScheduledCoupons(scheduled)

    }, [coupons])


    return (
        <div className="p-5 px-10 w-full">
            <Button variant={'ghost'} className="cursor-pointer"
                onClick={() => history.back()}
            ><ChevronLeft /> Back</Button>
            <div className="flex items-center w-full ">
                <h1 className="text-3xl font-bold font-display mt-3">Coupon Management</h1>

                {/* dialog */}
                <Dialog>
                    <DialogTrigger className="ml-auto rounded-sm" asChild>
                        <Button className="ml-auto rounded-sm">Create New Coupon</Button>
                    </DialogTrigger>
                    <DialogContent
                        className="md:h-[90vh] h-[70vh]  overflow-y-auto"
                        onInteractOutside={(e) => e.preventDefault()}
                        onEscapeKeyDown={(e) => e.preventDefault()}
                    >
                        <DialogTitle>New Coupon</DialogTitle>
                        <NewCoupon isScheduling={false} isEdit={false} coupon={null} />
                    </DialogContent>
                </Dialog>
            </div>
            <div>
                {/* some chart like stuff */}
            </div>

            <CouponsList coupons={activeCoupons} error={error} isLoading={isLoading} isScheduling={true} />

            <div className="flex items-center w-full mt-20 ">
                <h1 className="text-2xl font-bold font-display">No Coupons Scheduled</h1>
                {/* dialog */}
                <Dialog>
                    <DialogTrigger className="ml-auto rounded-sm" asChild>
                        <Button className="ml-auto rounded-sm">Schedule A New Coupon</Button>
                    </DialogTrigger>
                    <DialogContent
                        className="md:h-[90vh] h-[70vh]  overflow-y-auto"
                        onInteractOutside={(e) => e.preventDefault()}
                        onEscapeKeyDown={(e) => e.preventDefault()}
                    >
                        <NewCoupon isScheduling={true} isEdit={false} coupon={null}/>
                    </DialogContent>
                </Dialog>
            </div>

            <CouponsList  coupons={scheduledCoupons} error={error} isLoading={isLoading} isScheduling={true} />


        </div>
    )
}

export default CouponPage
