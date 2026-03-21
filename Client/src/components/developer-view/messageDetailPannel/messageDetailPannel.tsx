import type { DLQItem } from "@/hooks/queries/useDLQ"
import { Copy } from "lucide-react"

const MessageDetailPannel = (dlqData: DLQItem) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(dlqData, null, 2))
    }

    return (
        <div className="w-[380px] bg-white border rounded-xl shadow-2xl overflow-hidden">

            {/* 🔥 Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b bg-muted/50">
                <div>
                    <p className="text-sm font-semibold">DLQ Event</p>
                    <p className="text-xs text-muted-foreground">
                        {dlqData.eventType}
                    </p>
                </div>

                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-black transition"
                >
                    <Copy size={14} />
                    Copy
                </button>
            </div>

            {/* 🔥 Status + meta */}
            <div className="px-4 py-2 border-b flex justify-between items-center text-xs">
                <span className="font-mono text-muted-foreground">
                    {dlqData.eventId.slice(0, 16)}...
                </span>

                <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                    {dlqData.status}
                </span>
            </div>

            {/* 🔥 JSON Viewer */}
            <div className="max-h-[300px] overflow-auto bg-black text-green-400 text-xs font-mono p-3">
                <pre className="whitespace-pre-wrap">
                    {JSON.stringify(dlqData, null, 2)}
                </pre>
            </div>

            {/* 🔥 Footer */}
            <div className="px-4 py-2 border-t text-xs text-muted-foreground flex justify-between">
                <span>Retries: {dlqData.retryCount}</span>
                <span>
                    {new Date(dlqData.failedAt).toLocaleTimeString()}
                </span>
            </div>
        </div>
    )
}

export default MessageDetailPannel