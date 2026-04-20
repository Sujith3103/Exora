import { Button } from '@/components/ui/button'
import { useState } from 'react'
import DLQ_Logger from './logger/DLQ_Logger'
import DLQ_Latency from './latency/DLQ_Latency'
import server from '@/api/axiosinstance'
import { toast } from 'sonner'

const METRICS_TABS = [
  { id: 'logger', label: 'Logger', component: DLQ_Logger },
  { id: 'latency', label: 'Latency', component: DLQ_Latency },
  { id: 'log-history', label: 'Log-History', component: DLQ_Latency }
]

type DLQItem = {
  eventId: string
  status: 'FAILED' | 'RETRYING' | 'SUCCESS' | string
  retryCount: number
  eventType: string
  failedAt: string
  [key: string]: any
}




const DQLMetrics = () => {
  const [activeMetrics, setActiveMetrics] = useState(METRICS_TABS[0].id)

  const [editedItem, setEditedItem] = useState<DLQItem | null>(null)
  const [isReplaying, setIsReplaying] = useState(false)

  const ActiveComponent = METRICS_TABS.find(
    tab => tab.id === activeMetrics
  )?.component

  const startReplay = async () => {
    setIsReplaying(true)

    try {
      console.log("message inspector: ", editedItem)

      await server.post('/developer/dead-letter-queue/replay',editedItem)

    } catch (err) {
      toast.error('Failed to replay the message', { duration: 2000 })
    } 
  }

  return (
    <div className="px-5">
      <h1 className="text-3xl font-bold font-display mt-5">
        DLQ METRICS
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mt-3">
        {METRICS_TABS.map(tab => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => setActiveMetrics(tab.id)}
            className={`
              relative px-4 py-2 transition-all hover:bg-neutral-200 cursor-pointer
              ${activeMetrics === tab.id
                ? 'text-black'
                : 'text-muted-foreground'}
            `}
          >
            {tab.label}
            {activeMetrics === tab.id && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black rounded" />
            )}
          </Button>
        ))}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between bg-stone-100 px-4 py-2 rounded-md mt-4">
        <p className="text-sm text-muted-foreground">
          Control DLQ replay & monitor behavior
        </p>
        <Button className='cursor-pointer' onClick={() => startReplay()}>Start Replay</Button>
      </div>

      {/* Active View */}
      <div className="mt-4 ">
        {ActiveComponent && <ActiveComponent editedItem={editedItem} setEditedItem={setEditedItem} isReplaying={isReplaying} setIsReplaying={setIsReplaying}/>}
      </div>
    </div>
  )
}

export default DQLMetrics