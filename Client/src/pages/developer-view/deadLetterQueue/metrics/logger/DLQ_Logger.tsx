import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useDLQ } from '@/hooks/queries/useDLQ'
import { useParams } from 'react-router-dom'
import ReactJson from '@microlink/react-json-view'
import Timeline from './timeLine'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type DLQItem = {
    eventId: string
    status: 'FAILED' | 'RETRYING' | 'SUCCESS' | string
    retryCount: number
    eventType: string
    failedAt: string
    [key: string]: any
}

const capitalizeFirst = (str: string) => {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const DLQ_Logger = () => {

    const { id } = useParams<{ id: string }>()
    const { data } = useDLQ()

    const item = (data as DLQItem[] | undefined)?.find(
        d => d.eventId === id
    )

    const [editMode, setEditMode] = useState(false)
    //jsontext is what you see when you click the edit button
    const [jsonText, setJsonText] = useState('')
    const [editedItem, setEditedItem] = useState<DLQItem | null>(null)
    const [jsonError, setJsonError] = useState<string | null>(null)

    useEffect(() => {
        if (item) {
            setEditedItem(item)
            setJsonText(JSON.stringify(item, null, 2))
        }
    }, [item])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                JSON.stringify(editedItem || item, null, 2)
            )
            toast.success("Copied to clipboard", { style: { justifyContent: 'center' }, duration: 1500 })
        } catch (err) {
            console.error("Error copying : ", err)
        }
    }

    //handles the edit of json
    const handleChange = (value: string) => {
        setJsonText(value)

        //try is used so when invalid json->it doesnt break the page
        try {
            const parsed = JSON.parse(value)
            setEditedItem(parsed)
            setJsonError(null)
        } catch (err: any) {
            setJsonError(err.message)
        }
    }

    //saving of edited json
    const handleSave = () => {
        if (jsonError) {
            toast.error("Fix JSON errors before saving", { style: { justifyContent: 'center' }, duration:1500})
            return
        }

        try {
            toast.success("JSON ready for retry", { style: { justifyContent: 'center' }, duration: 1500 })
            setEditMode(false)
        } catch {
            toast.error("Invalid JSON format", { style: { justifyContent: 'center' }, duration:2500})
        }
    }

    if (!item) return <p className="p-4">No data found</p>

    return (
        <div className="w-full flex gap-4 max-h-[100vh] ">

            {/* LEFT PANEL */}
            <section className="w-1/2">
                <Card className="h-[70vh] flex flex-col p-0 gap-3 rounded-sm">

                    {/* HEADER */}
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h3 className="font-semibold text-lg">
                            {capitalizeFirst(item.eventType)} Inspector
                        </h3>

                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={handleCopy}>
                                Copy
                            </Button>

                            {!editMode ? (
                                <Button size="sm" onClick={() => setEditMode(true)}>
                                    Edit
                                </Button>
                            ) : (
                                <>
                                    <Button size="sm" onClick={handleSave}>
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditMode(false)}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* JSON VIEWER / EDITOR */}
                    <div className="flex-1 overflow-auto px-4">

                        {!editMode ? (
                            <ReactJson
                                src={editedItem || item}   
                                collapsed={2}
                                displayDataTypes={false}
                                enableClipboard={false}
                                style={{
                                    fontSize: '13px',
                                    background: 'transparent'
                                }}
                            />
                        ) : (
                            <>
                                <textarea
                                    className="w-full h-full p-2 font-mono text-sm border rounded"
                                    value={jsonText}
                                    onChange={(e) => handleChange(e.target.value)}
                                />

                                {jsonError && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {jsonError}
                                    </p>
                                )}
                            </>
                        )}

                    </div>

                </Card>
            </section>

            {/* RIGHT PANEL */}
            <section className="w-1/2">
                <Card className="h-[70vh] flex flex-col rounded-sm p-0 pt-3 gap-1">
                    <div className="border-b px-4 py-2">
                        <h3 className="font-semibold text-lg">Execution Timeline</h3>
                    </div>

                    <div className="flex-1 overflow-auto px-2">
                        <Timeline />
                    </div>

                </Card>
            </section>

        </div>
    )
}

export default DLQ_Logger