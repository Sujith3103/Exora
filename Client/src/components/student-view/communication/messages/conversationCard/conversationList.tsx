import type { Conversation } from "@/config/config"
import type { RootState } from "@/store"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

type ConversationCardProps = {

  conversation: Conversation

}

type ConversationData = {
  profileImage: string | null,
  senderId: string,
  lastMessage: string
  // userId: string,
  lastMessageDate: string,
  unread: boolean
}

const ConversationCard = ({ conversation }: ConversationCardProps) => {

  const userId = useSelector((state: RootState) => state.auth.user?.id)

  const [conversationData, setConversationData] = useState<ConversationData>({

    lastMessage: '',
    lastMessageDate: '',
    senderId: '',
    profileImage: null,
    unread: false,
    // userId: ''
  })

  const updateConversationData = () => {

    const SenderProfile = conversation.conversationParticipant.filter(c => c.userId != userId as unknown as string)[0]
    const userProfile = conversation.conversationParticipant.filter(c => c.userId === userId as unknown as string)[0]

    const senderId = conversation.messages[0].senderId
    const lastMessage = conversation.messages[0].content
    const lastMessageDate = conversation.updatedAt

    const unRead = userProfile.lastMessageRead

    setConversationData({
      unread: unRead,
      lastMessageDate: lastMessageDate,
      lastMessage: lastMessage,
      profileImage: SenderProfile.user.profile?.profileImg || null,
      senderId: senderId
    })

  }

  useEffect(() => {

    console.log("convertion", conversation)
    updateConversationData()
  }, [conversation])

  // const lastMessage = conversation.messages[conversation.messages.length - 1]
  // const participants = conversation.conversationParticipant.map(p => p.user.name).join(", ")
  console.log(conversation)
  return (
    <div className="p-4 border rounded mb-2">

      {
        conversationData.lastMessage
      }

    </div>
  )
}

export default ConversationCard


