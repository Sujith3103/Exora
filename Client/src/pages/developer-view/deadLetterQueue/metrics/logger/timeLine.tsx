type TimelineEvent = {
    step: string
    status: 'SUCCESS' | 'FAILED' | 'RETRYING'
    timestamp: string
    message?: string
}

type Props = {
    item: any
}

const Timeline = ({ item }: Props) => {
    const events: TimelineEvent[] = item?.logs || []

    if (!events.length) {
        return (
            <p className="text-sm text-muted-foreground">
                No execution logs available
            </p>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {events.map((event, index) => (
                <div key={index} className="flex gap-3">

                    {/* Dot */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-3 h-3 rounded-full ${event.status === 'FAILED'
                                    ? 'bg-red-500'
                                    : event.status === 'RETRYING'
                                        ? 'bg-yellow-500'
                                        : 'bg-green-500'
                                }`}
                        />
                        {index !== events.length - 1 && (
                            <div className="w-[2px] flex-1 bg-muted" />
                        )}
                    </div>
                        
                    {/* Content */}
                    <div className="flex flex-col">
                        <span className="font-medium">{event.step}</span>
                        <span className="text-xs text-muted-foreground">
                            {event.timestamp}
                        </span>
                        {event.message && (
                            <span className="text-sm">{event.message}</span>
                        )}
                    </div>

                </div>
            ))}
        </div>
    )
}

export default Timeline