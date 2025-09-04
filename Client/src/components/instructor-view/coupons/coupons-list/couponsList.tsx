import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const CouponsList = () => {


    return (
        <div>
            <Table className="mt-5">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px] ">Title</TableHead>
                        <TableHead className="">Code</TableHead>
                        <TableHead className="">Type</TableHead>
                        <TableHead className="">Discount</TableHead>
                        <TableHead className="">Limit</TableHead>
                        <TableHead className="">Limit/user</TableHead>
                        <TableHead className="">Only for</TableHead>
                        <TableHead className="">Times Used</TableHead>
                        <TableHead className="">Revenue</TableHead>
                        <TableHead className="">Valid Until</TableHead>
                        <TableHead className="">Apply To</TableHead>
                        <TableHead className="">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">smth</TableCell>
                        <TableCell className=''>smth</TableCell>
                        <TableCell className=''>smth</TableCell>
                        <TableCell className="">smth</TableCell>
                        <TableCell className="">smth</TableCell>
                        <TableCell className="">smth</TableCell>
                        <TableCell className="">smth</TableCell>
                        <TableCell className="">smth</TableCell>
                        <TableCell className="">smth</TableCell>
                        <TableCell className="">smth</TableCell>
                        <TableCell className="">smth</TableCell>
                        <TableCell className="">smth</TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                    {/* <TableRow>
                            <TableCell colSpan={3}>Total Revenue Generated</TableCell>
                            <TableCell className="text-right">$2,500.00</TableCell>
                        </TableRow> */}
                </TableFooter>
            </Table>

        </div>
    )
}

export default CouponsList
