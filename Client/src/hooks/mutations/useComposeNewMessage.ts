import server from "@/api/axiosinstance"
import type { Conversation } from "@/config/config"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type ComposeNewMessageProps = {

    userName: string
    content: string
}

export const useComposeNewMessage = () => {

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
    const updateMessages = useMutation({
        mutationFn: async (conversation: Conversation) => {
            queryClient.setQueryData(['messages'], (old: any) => {
                if (!old?.data) return { ...old, data: [conversation] }
                return { ...old, data: [conversation, ...old.data] }
            })
        }
    })


    return { composeNewMessage, updateMessages }
}