import server from "@/api/axiosinstance"
import type { ConversationData } from "@/components/student-view/communication/messages/conversationCard/conversationList"
import type { Conversation } from "@/config/config"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type ComposeNewMessageProps = {

    userName: string
    content: string
}

type UpdateAsUnreadProps = {

    setConversationData: React.Dispatch<React.SetStateAction<ConversationData>>
    conversation: Conversation,
    read: boolean,
    userId: string
}

export const useMessage = () => {

    const queryClient = useQueryClient()

    const composeNewMessage = useMutation({

        mutationFn: async ({ content, userName }: ComposeNewMessageProps) => {

            const res = await server.post(`/communication/message/compose`, {
                content, userName
            })

            return res.data
        },

        onMutate: () => {

            toast.loading('composing the message', { style: { justifyContent: 'center' } })
        },

        onSettled: (data) => {
            if (data.success) {
                queryClient.setQueryData(['messages'], (old: any) => {
                    if (!old?.data) return { ...old, data: [data.data] }
                    return { ...old, data: [data.data, ...old.data] }
                })
                toast.dismiss()
                toast.success('sent a message successfully', { style: { justifyContent: 'center' }, duration: 2000 })
            }
            else {
                toast.dismiss()
                toast.error(data.message, { style: { justifyContent: 'center' } })
            }
        }

    })

    const updateAsUnread = useMutation({

        mutationFn: async ({ conversation, setConversationData, read, userId }: UpdateAsUnreadProps) => {
            const isRead = read ? false : true
            const coversationParticipantId = conversation.conversationParticipant.filter(c => c.userId == userId)[0].id
            const res = await server.patch(`/communication/message/${coversationParticipantId}/unread`, {
                read: isRead
            })
            return res.data
        },
        onMutate: ({ conversation, setConversationData }) => {

            setConversationData(prev => ({
                ...prev,
                unread: !prev.unread
            }))

        },

    })


    return { composeNewMessage, updateAsUnread }
}