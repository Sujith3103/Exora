import type { Conversation, ConversationParticipant } from "@/config/config"
import { useMessage } from "@/hooks/mutations/useMessage"
import type { RootState } from "@/store"
import { Circle, UserCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

type ConversationCardProps = {
  conversation: Conversation
}

export type ConversationData = {
  profileImage: string | null
  senderId: string
  user2: ConversationParticipant | null
  lastMessage: string
  lastMessageDate: string
  unread: boolean
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return "just now"
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHr < 24) return `${diffHr} hr ago`
  if (diffDay < 7) return `${diffDay} days ago`
  if (diffDay < 365)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

const ConversationCard = ({ conversation }: ConversationCardProps) => {
  const userId = useSelector((state: RootState) => state.auth.user?.id)

  const navigate = useNavigate()
  const location = useLocation()

  const { updateAsUnread } = useMessage()

  const [conversationData, setConversationData] = useState<ConversationData>({
    lastMessage: "",
    lastMessageDate: "",
    senderId: "",
    profileImage: null,
    unread: false,
    user2: null,
  })

  const [activeConvoId, setActiveConvoId] = useState<string>('')

  const updateConversationData = () => {
    const SenderProfile = conversation.conversationParticipant.find(
      (c) => c.userId !== (userId as unknown as string)
    )
    const userProfile = conversation.conversationParticipant.find(
      (c) => c.userId === (userId as unknown as string)
    )

    const senderId = conversation.messages[0]?.senderId || ""
    const lastMessage = conversation.messages[0]?.content || ""
    const lastMessageDate = conversation.updatedAt

    const unRead = userProfile?.lastMessageRead ?? false

    setConversationData({
      unread: unRead,
      lastMessageDate,
      lastMessage,
      profileImage: SenderProfile?.user.profile?.profileImg || null,
      senderId,
      user2: SenderProfile || null,
    })
  }

  const handleClick_toggleUnread = () => {

    updateAsUnread.mutate({ conversation: conversation, setConversationData: setConversationData, read: conversationData.unread, userId: userId as unknown as string }, {

    })

  }

  useEffect(() => {
    setActiveConvoId(location.pathname.split('/')[4])
  }, [location])

  useEffect(() => {
    updateConversationData()
  }, [conversation])

  return (
    <div className={`p-3 border-b flex gap-3 hover:bg-gray-100 cursor-pointer transition ${activeConvoId === conversation.id && 'bg-gray-100'}`} onClick={() => navigate(`/profile/communication/messages/${conversation.id}`)}>
      {/* Avatar */}
      {conversationData.profileImage ? (
        <img
          src={conversationData.profileImage}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <UserCircleIcon strokeWidth={1} className="w-10 h-10 text-gray-400" />
      )}

      {/* Middle Section */}
      <div className="flex-1 min-w-0 ">
        {/* Top row: Name + Unread circle */}
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold truncate">
            {conversationData.user2?.user.name}
          </p>
          <div className="group relative flex">

            <Circle
              strokeWidth={1}
              size={13}
              className="text-purple-500 shrink-0 ml-2"
              fill={`${conversationData.unread ? 'currentColor' : 'white'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleClick_toggleUnread()
              }}
            />
            <span className="border absolute right-5 -top-3 group-hover:flex hidden bg-black rounded-sm text-white p-2 text-sm whitespace-nowrap">
              {!conversationData.unread ? 'Mark as unread' : 'Mark as read'}
            </span>
          </div>
        </div>

        {/* Bottom row: Last message + Date */}
        <div className="flex justify-between items-center mt-3">
          <div className={`text-sm text-gray-600 truncate max-w-[80%] ${conversationData.unread && 'font-bold'} `}>
            {conversationData.senderId === (userId as unknown as string) && "You: "}
            {conversationData.lastMessage}
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formatDate(conversationData.lastMessageDate)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ConversationCard
