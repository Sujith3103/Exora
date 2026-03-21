import server from "@/api/axiosinstance"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export type DLQEventMetaData = {
    id: string;
    content: string;
    senderId: string;
    createdAt: string; // ISO string
    conversationId: string;
    automatedMessage: boolean;
};

export type DLQItem = {
    eventId: string;
    eventMetaData: DLQEventMetaData;
    retryCount: number;
    failedAt: string; // ISO string
    eventType: "message" | string; // extensible
    error: string | null;
    status: "failed" | "processing" | "success" | string;
};

export const useDLQ =  () => {
    
    return useQuery<DLQItem[]>({
        queryKey: ['DLQ'],
        queryFn: async () => {
            const res = await server.get('/developer/dead-letter-queue')
            return res.data.dlqData
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    })
}