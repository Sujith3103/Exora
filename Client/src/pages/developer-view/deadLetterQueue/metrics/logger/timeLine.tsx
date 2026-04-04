import server from "@/api/axiosinstance"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

type TimelineEvent = {
    step: string
    status: 'SUCCESS' | 'FAILED' | 'RETRYING'
    timestamp: string
    message?: string
}

const Timeline = () => {
    const [events, setEvents] = useState<TimelineEvent[]>([])
    const [loading, setLoading] = useState(true)

    const { id } = useParams()

    const getExecutionTimeline = async () => {
        try {
            const res = await server.get(
                `/developer/dead-letter-queue/execution/timeline/${id}`
            )
            console.log(res)
            const attempt = res.data?.lastAttempt

            if (attempt) {
                const formatted: TimelineEvent[] = attempt.metadata.map((m: any) => ({
                    step: m.stage,
                    status: m.isError
                        ? 'FAILED'
                        : m.status === 'Processing'
                            ? 'RETRYING'
                            : 'SUCCESS',
                    timestamp: attempt.executedAt,
                    message: m.message
                }))

                setEvents(formatted)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getExecutionTimeline()
    }, [])

    if (loading) {
        return <p className="text-sm text-gray-400">Loading timeline...</p>
    }

    if (!events.length) {
        return (
            <div className="text-sm text-gray-400">
                No execution logs available
            </div>
        )
    }

    return (
        <div className="w-full h-full bg-[#0a0a0a] text-gray-200">

            {/* HEADER */}
            <div className="px-6 py-4 border-b border-[#1f1f1f] flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold tracking-wide text-gray-100">
                        EXECUTION TIMELINE
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Attempt #5 • Final • Failed
                    </p>
                </div>

                <div className="text-xs px-2 py-1 border border-red-500/30 text-red-400 rounded">
                    FAILED
                </div>
            </div>

            {/* BODY */}
            <div className="px-6 py-4 flex flex-col">

                {events.map((event, index) => (
                    <div key={index} className="flex gap-4 py-4 border-b border-[#141414] last:border-none">

                        {/* LEFT COLUMN (timeline) */}
                        <div className="flex flex-col items-center w-6">
                            <div
                                className={`w-2 h-2 rounded-full
                            ${event.status === 'FAILED'
                                        ? 'bg-red-500'
                                        : event.status === 'RETRYING'
                                            ? 'bg-yellow-400'
                                            : 'bg-green-500'
                                    }`}
                            />
                            {index !== events.length - 1 && (
                                <div className="w-[1px] flex-1 bg-[#2a2a2a] mt-2" />
                            )}
                        </div>

                        {/* MAIN CONTENT */}
                        <div className="flex flex-col w-full">

                            {/* Top Row */}
                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-100">
                                        {event.step}
                                    </span>

                                    <span
                                        className={`text-[10px] uppercase tracking-wide px-2 py-[2px] rounded
                                    ${event.status === 'FAILED'
                                                ? 'bg-red-500/10 text-red-400'
                                                : event.status === 'RETRYING'
                                                    ? 'bg-yellow-500/10 text-yellow-400'
                                                    : 'bg-green-500/10 text-green-400'
                                            }`}
                                    >
                                        {event.status}
                                    </span>
                                </div>

                                <span className="text-[11px] text-gray-500">
                                    {new Date(event.timestamp).toLocaleTimeString()}
                                </span>
                            </div>

                            {/* Message */}
                            {event.message && (
                                <div className="mt-2 text-sm text-gray-400 leading-relaxed">
                                    {event.message}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Timeline