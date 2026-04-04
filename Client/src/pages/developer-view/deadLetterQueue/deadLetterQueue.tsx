import MessageDetailPannel from "@/components/developer-view/messageDetailPannel/messageDetailPannel"
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
import { type DLQItem, useDLQ } from "@/hooks/queries/useDLQ"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const DeadLetterQueue = () => {

    const { data: dlqData, isLoading: isDLQLoading } = useDLQ()

    const [hoverData, setHoverData] = useState<DLQItem>();

    const navigate = useNavigate()

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setHoverData(undefined);
        }, 200);
    };

    if (isDLQLoading) {
        return
    }

    return (
        <div className="px-5 py-2 space-y-10">
            <h1 className="font-bold text-3xl">Dead Letter Queue</h1>

            <section>
                <Card className="px-2 py-2">
                    <Table className="overflow-y-scroll">
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
                            {dlqData?.map((data) => (
                                <TableRow
                                    key={data.eventId}
                                    className="hover:bg-muted/50 transition relative"

                                >
                                    <TableCell><Checkbox /></TableCell>

                                    <TableCell className="font-mono text-xs">
                                        {data.eventId.slice(0, 12)}...
                                    </TableCell>

                                    <TableCell className="text-center">{data.eventType}</TableCell>

                                    <TableCell className="text-center text-red-400 truncate max-w-[150px]">
                                        {data.error || "No error"}
                                    </TableCell>

                                    <TableCell className="text-center">{data.retryCount}</TableCell>

                                    <TableCell className="text-center text-sm text-muted-foreground">
                                        {new Date(data.failedAt).toLocaleString()}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                                            {data.status}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onMouseEnter={() => {
                                                if (timeoutRef.current) {
                                                    clearTimeout(timeoutRef.current);
                                                }
                                                setHoverData(data);
                                            }}
                                            onMouseLeave={handleLeave}
                                        >
                                            View
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => navigate(`/developer/dashboard/dead-letter-queue/${data.eventId}`)}>
                                            Retry
                                        </Button>
                                    </TableCell>

                                    {/* 🔥 Floating Panel */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
                {hoverData && (
                    <div className="absolute right-40 top-10 z-50 mt-2 "
                    onMouseEnter={()=>handleEnter()}
                    onMouseLeave={()=>handleLeave()}
                    >
                        <MessageDetailPannel {...hoverData} />
                    </div>
                )}
            </section>
        </div>
    )
}

export default DeadLetterQueue