import CouponsList from "@/components/instructor-view/coupons/coupons-list/couponsList"
import NewCoupon from "@/components/instructor-view/coupons/new-coupon/newCoupon"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft } from "lucide-react"

const CouponPage = () => {

    // useEffect(() => {
    //     toast("the event has been created", {
    //         style: { justifyContent:'center'}
    //     });
    // }, []);



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
                        <NewCoupon isScheduling={false} />
                    </DialogContent>
                </Dialog>
            </div>
            <div>
                {/* some chart like stuff */}
            </div>

            <CouponsList isScheduling={true} />

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
                        <NewCoupon isScheduling={true} />
                    </DialogContent>
                </Dialog>
            </div>

            <CouponsList isScheduling={true} />


        </div>
    )
}

export default CouponPage
