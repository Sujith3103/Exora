import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCoupon } from '@/hooks/queries/useCoupon'

const CouponsList = ({ isScheduling }: { isScheduling: boolean }) => {

    const { data: coupons, isLoading, error } = useCoupon()

    return (
        <div>
            <Table className="mt-5 table-fixed">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px] text-left ">Title</TableHead>
                        <TableHead className="text-center">Code</TableHead>
                        <TableHead className="text-center">Discount Type</TableHead>
                        <TableHead className="text-center">Discount</TableHead>
                        <TableHead className="text-center">No of Coupons</TableHead>
                        <TableHead className="text-center">Limit/user</TableHead>
                        <TableHead className="text-center">Only for</TableHead>
                        <TableHead className="text-center">Times Used</TableHead>
                        <TableHead className="text-center">Revenue</TableHead>
                        <TableHead className="text-center">Valid Until</TableHead>
                        <TableHead className="text-center">Apply To</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {coupons?.map((coupon) => (
                        <TableRow key={coupon.code}>
                            <TableCell className="text-left w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
                                {coupon.title}
                            </TableCell>
                            <TableCell className="text-center">{coupon.code}</TableCell>
                            <TableCell className="text-center">{coupon.discountType}</TableCell>
                            <TableCell className="text-center">{coupon.discount}</TableCell>
                            <TableCell className="text-center">{coupon.noOfCoupons}</TableCell>
                            <TableCell className="text-center">{coupon.limitPerUser}</TableCell>
                            <TableCell className="text-center">{coupon.onlyFor}</TableCell>
                            <TableCell className="text-center">{coupon.timesUsed}</TableCell>
                            <TableCell className="text-center">{coupon.totalRevenue}</TableCell>
                            <TableCell className="text-center">
                                {new Date(coupon.validUntil).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-center">{coupon.applyTo}</TableCell>
                            <TableCell className="text-center">active</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CouponsList
