import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Coupon } from '@/config/config'
import { Edit, Trash } from 'lucide-react'
import { useState } from 'react'
import NewCoupon from '../new-coupon/newCoupon'
import useCouponMutation from '@/hooks/mutations/useCouponMutation'

type CouponListProps = {
    isScheduling: boolean,
    coupons: Coupon[],
    isLoading: boolean,
    error: Error | null
}

const CouponsList = ({ isScheduling, coupons,  }: CouponListProps) => {

    const { deleteCoupon } = useCouponMutation()
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const [couponEditing, setCouponEditing] = useState<Coupon>()

    const handleClick_Edit = (coupon: Coupon) => {
        setCouponEditing(coupon)
        setIsDialogOpen(true)
    }

    const handleClick_Delete = (coupon: any) => {
        deleteCoupon.mutate(coupon)
    }


    return (
        <div className="w-full overflow-x-auto">
            <Table className="mt-5 min-w-[1200px]">
                <TableCaption>A list of your recent Coupons</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="lg:w-[100px] w-[60px] text-left">Title</TableHead>
                        <TableHead className="text-center">Code</TableHead>
                        <TableHead className="text-center">Discount Type</TableHead>
                        <TableHead className="text-center">Discount</TableHead>
                        <TableHead className="text-center">No of Coupons</TableHead>
                        <TableHead className="text-center">Limit/user</TableHead> 
                        <TableHead className="text-center">Only for</TableHead>
                        <TableHead className="text-center">Redeemed</TableHead>
                        <TableHead className="text-center">Times Applied</TableHead>
                        <TableHead className="text-center">Revenue</TableHead>
                        {isScheduling && (
                            <TableHead className="text-center">Valid From</TableHead>
                        )}
                        <TableHead className="text-center">Valid Until</TableHead>
                        <TableHead className="text-center">Apply To</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {coupons?.map((coupon) => (
                        <TableRow key={coupon.code}>
                            <TableCell className="text-left w-[100px] whitespace-nowrap overflow-hidden text-ellipsis">
                                {coupon.title}
                            </TableCell>
                            <TableCell className="text-center">{coupon.code}</TableCell>
                            <TableCell className="text-center">{coupon.discountType}</TableCell>
                            <TableCell className="text-center">{coupon.discount}</TableCell>
                            <TableCell className="text-center">{coupon.noOfCoupons}</TableCell>
                            <TableCell className="text-center">{coupon.limitPerUser}</TableCell>
                            <TableCell className="text-center">{coupon.onlyFor}</TableCell>
                            <TableCell className="text-center">{coupon.timesUsed}</TableCell>
                            <TableCell className="text-center">{coupon.timesApplied}</TableCell>
                            <TableCell className="text-center">{coupon.totalRevenue}</TableCell>
                            {isScheduling && (
                                <TableCell className="text-center">
                                    {new Date(coupon.validUntil).toISOString().split("T")[0]
                                    }
                                </TableCell>
                            )}
                            <TableCell className="text-center">
                                {new Date(coupon.validUntil).toISOString().split("T")[0]
                                }
                            </TableCell>
                            <TableCell className="text-center">{coupon.applyTo}</TableCell>
                            <TableCell className="text-center">active</TableCell>
                            <TableCell className="text-center flex items-center justify-center gap-2">
                                <Edit size={17} className="cursor-pointer text-blue-500 hover:text-blue-700" onClick={() => handleClick_Edit(coupon)} />
                                <Trash size={17} className="cursor-pointer text-red-500 hover:text-red-700" onClick={() => handleClick_Delete(coupon)} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent
                    className="md:h-[90vh] h-[70vh]  overflow-y-auto"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogTitle>
                        Editing a Coupon
                    </DialogTitle>
                    <NewCoupon isScheduling={false} isEdit={true} coupon={couponEditing!} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                </DialogContent>
            </Dialog>
        </div>
    );

}

export default CouponsList
