import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useDLQ } from "@/hooks/queries/useDLQ"
import { Copy } from "lucide-react"

const DeadLetterQueue = () => {


    const { data: dlqData, isLoading: isDLQLoading } = useDLQ()

    if (isDLQLoading) {
        return
    }

    return (
        <div className="px-5 py-2 space-y-10">
            <h1 className="font-bold text-3xl">Dead Letter Queue</h1>

            <section>
                <Card className="px-2 py-2">
                    <Table className="">
                        {/* ✅ Header */}
                        <TableHeader className="border-b">
                            <TableRow>
                                <TableHead><Checkbox /></TableHead>
                                <TableHead >Event Id</TableHead>
                                <TableHead className="text-center">Event Type</TableHead>
                                <TableHead className="text-center">Error</TableHead>
                                <TableHead className="text-center">Retry Count</TableHead>
                                <TableHead className="text-center">Failed At</TableHead>
                                <TableHead className="text-center">Status</TableHead>

                                {/* ✅ Action columns */}
                                <TableHead className="text-right"></TableHead>
                                {/* <TableHead className="text-right"></TableHead> */}
                            </TableRow>
                        </TableHeader>

                        {/* ✅ Body */}
                        <TableBody className="divide-y">
                            {
                                dlqData?.map((data) => (
                                    <TableRow className="hover:bg-muted/50 transition">

                                        <TableCell><Checkbox /></TableCell>

                                        <TableCell className="items-center">{data.eventId}</TableCell>
                                        <TableCell className="text-center">{data.eventType}</TableCell>
                                        <TableCell className="text-center">{data.error} some error</TableCell>
                                        <TableCell className="text-center">{data.retryCount}</TableCell>
                                        <TableCell className="items-center">{new Date(data.failedAt).toLocaleString()}</TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-red-500 font-medium">{data.status}</span>
                                        </TableCell>
                                        <TableCell className="text-center space-x-2 w-[200px] ">
                                            <Button size="sm" variant="outline">
                                                View Details
                                            </Button>
                                            <Button size="sm" variant="outline" className="w-20">
                                                Retry
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }


                            {/* ✅ Status with color */}


                            {/* ✅ Buttons */}



                        </TableBody>
                    </Table>
                </Card>
            </section>
        </div>
    )
}

export default DeadLetterQueue