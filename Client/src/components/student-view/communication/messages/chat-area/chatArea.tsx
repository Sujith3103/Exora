import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { EllipsisVertical, UserCircleIcon } from "lucide-react";
import { useGetMessageById } from "../../hooks/useGetMessageById";
import type { RootState } from "@/store";
import type { User } from "@/config/config";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/socketContext";

type ChatAreaType = {
  userProfile: User | null;
  otherUserProfile: User | null;
};

type ConversationData = {
  conversationId: string,
  otherUserId: string
}

type PresenceEvent = {
  userId: string;
  status: "online" | "offline";
};

type TypingEvent = {
  conversationId: string;
  userId: string
  typingStatus: "start" | "stop"
}
export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  automatedMessage: boolean;
  createdAt: string; // ISO string (UTC)
};

export type MessagesResponse = Message[];



const ChatArea = () => {
  const location = useLocation();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data, isLoading, isError, isSuccess } = useGetMessageById(
    location.pathname.split("/")[4]
  );

  const { socket } = useSocket()

  const [isOnlineUser, setIsOnlineUser] = useState<Boolean>(false);
  const [typingEventState, setTypingEventState] = useState<TypingEvent>({
    conversationId: '',
    userId: '',
    typingStatus: 'stop'
  })

  const [chatMetaData, setChatMetaData] = useState<ChatAreaType>({
    userProfile: null,
    otherUserProfile: null,
  });

  const [draftMessage, setDraftMessage] = useState<string>("")
  const [chatMessage, setChatMessage] = useState<MessagesResponse>()

  function formatChatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    const isSameDay =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isSameDay) return "Today";

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();

    if (isYesterday) return "Yesterday";

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  }

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);


  //SOCKET STUFF HERE
  function handleTyping(e: React.ChangeEvent<HTMLTextAreaElement>) {

    setDraftMessage(e.target.value)

    const conversationId = location.pathname.split("/")[4];

    if (!isTypingRef.current) {

      socket.emit("typing:command", {
        conversationId,
        typingStatus: "start",
        userId: userId?.toString()
      });

      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:command", {
        conversationId,
        typingStatus: "stop",
      });

      isTypingRef.current = false;
    }, 1000);
  }
  const handleTypingEvent = (event: TypingEvent) => {
    // Ignore my own typing
    if (event.userId === userId as unknown as string) return;
    setTypingEventState({
      conversationId: event.conversationId,
      typingStatus: event.typingStatus,
      userId: event.userId
    });

  };
  const convertDateToISTTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSendingMessage = () => {
    const message: Message = {
      automatedMessage: false,
      content: draftMessage,
      conversationId: typingEventState.conversationId,
      createdAt: new Date().toISOString(),
      id: '',
      senderId: userId as unknown as string
    }
    // setChatMessage(prev => [
    //   ...(prev || []),
    //   message
    // ])

    socket.emit('message:send', message)
  }

  useEffect(() => {
    socket.on("message:receive", (message: any) => {
      console.log("new message:", message)
      setChatMessage(prev => [
        ...(prev || []),
        message
      ])
    })

    return () => {
      socket.off("message:receive")
    }
  }, [])

  useEffect(() => {

    if (chatMetaData.otherUserProfile?.id == null) return

    const conversationData: ConversationData = {
      conversationId: location.pathname.split("/")[4],
      otherUserId: chatMetaData.otherUserProfile?.id?.toString()!
    }

    socket.emit('joinConversation', conversationData)

    socket.on('isOnlineUser', (response: boolean) => {
      if (response) {
        setIsOnlineUser(true)
      }
      else {
        setIsOnlineUser(false)
      }
    })



    socket.on(`presence:${conversationData.otherUserId}`, (response: PresenceEvent) => {
      console.log("presence changed")
      if (response.status === 'online') {
        setIsOnlineUser(true)
      }
      else {
        setIsOnlineUser(false)
      }
    })
    //will this useffect dependance array lead to a bug? cause we are using chatmetadata, is it efficient?

  }, [chatMetaData.userProfile?.id])

  useEffect(() => {
    if (!chatMetaData.otherUserProfile?.id) return;

    socket.on("typing:event", (event: TypingEvent) => {
      handleTypingEvent(event)
    });

    return () => {
      socket.off("typing:event", handleTypingEvent);
    };
  }, [chatMetaData.otherUserProfile?.id, userId]);

  useEffect(() => {

    setChatMessage(data?.messages)

  }, [isSuccess])

  useEffect(() => {
    console.log("chat : ", chatMessage)
  }, chatMessage)

  //TYPING EVENT
  // useEffect(() => {
  //   console.log("typing event state :",typingEventState)
  // }, [typingEventState])
  useEffect(() => {
    const otheruser = data?.conversationParticipant.find(
      (c) => c.userId !== userId as unknown as string
    )?.user;
    const user = data?.conversationParticipant.find(
      (c) => c.userId === userId as unknown as string
    )?.user;

    if (otheruser && user) {
      setChatMetaData({
        otherUserProfile: otheruser,
        userProfile: user,
      });
    }
  }, [data, userId]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading conversation...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-full">
        <p>Error loading messages.</p>
      </div>
    );

  return (
    <div className="flex flex-col h-[75vh] w-full overflow-hidden">
      {/* Header */}

      <div className="w-full px-4 py-3 border-b flex items-center gap-3">
        <p className="text-sm text-muted-foreground flex items-center space-x-2">
          <span>Conversation</span>
          <span>with</span>
          <span className="font-medium text-foreground">
            {chatMetaData.otherUserProfile?.name}
          </span>
        </p>

        <div className="flex items-center gap-1.5">
          <span
            className={`relative flex h-2.5 w-2.5`}
          >
            {isOnlineUser ? (
              <>
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </>
            ) : (
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-zinc-400" />
            )}
          </span>

          <span className="text-xs text-muted-foreground">
            {isOnlineUser ? "Online" : "Offline"}
          </span>
        </div>

        <EllipsisVertical strokeWidth={1} className="ml-auto text-muted-foreground" />
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-5 overflow-y-auto">
        {chatMessage?.map((message, i) => {
          // console.log("messages : ",message)
          const isOwnMessage = message.senderId === userId as unknown as string;
          const senderProfile = isOwnMessage
            ? chatMetaData.userProfile
            : chatMetaData.otherUserProfile;

          return (
            <div key={i} className="relative">
              {/* Date divider */}
              <>
                {/* {i === 0 ||
                formatChatDate(message.createdAt) !==
                formatChatDate(data.messages[i - 1].createdAt) ? (
                <p className="mb-4 text-center text-[13px] font-semibold uppercase text-muted-foreground">
                  {formatChatDate(message.createdAt)}
                </p>
              ) : null} */}
              </>
              {i === 0 ||
                new Date(message.createdAt).toDateString() !==
                new Date(chatMessage[i - 1].createdAt).toDateString() ? (
                <p className="mb-4 text-center text-[13px] font-semibold uppercase text-muted-foreground">
                  {formatChatDate(message.createdAt)}
                </p>
              ) : null}

              {/* Message bubble */}
              <article
                className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse text-right" : "flex-row"
                  }`}
              >
                {
                  senderProfile?.id != userId &&
                  <>
                    <div className="mt-1.5 h-9 w-9 rounded-2xl">
                      {
                        senderProfile?.profile?.profileImg ?
                          <>
                            <img
                              src={senderProfile?.profile?.profileImg}
                              alt=""
                              className="rounded-2xl object-cover h-full w-full"
                            />
                          </> :
                          (
                            <UserCircleIcon strokeWidth={1} className="w-10 h-10 text-gray-400" />
                          )

                      }
                    </div>

                  </>
                }
                <div className="flex-1 w-full">
                  <div
                    className={`mb-1 flex items-center gap-2 text-sm ${isOwnMessage ? "justify-end" : ""
                      }`}
                  >
                    <a href="#" className="font-medium text-brand hover:underline">
                      {senderProfile?.name}
                    </a>
                    <span className="text-muted-foreground text-xs">{convertDateToISTTime(message.createdAt)}</span>
                  </div>
                  {/* 
                    <div
                      className={`inline-block rounded-xl px-3 py-2 text-sm leading-6 break-words whitespace-pre-wrap ${isOwnMessage
                        ? "bg-blue-500 text-white ml-auto max-w-[70%]"
                        : "bg-gray-100 text-gray-800 mr-auto max-w-[70%]"
                        }`}
                    >
                      <p>{message.content || "..."}</p>
                    </div> */}
                  <div
                    className={`inline-block rounded-xl px-3 py-2 text-sm leading-6 break-words whitespace-pre-wrap text-left ${isOwnMessage
                      ? "bg-blue-500 text-white ml-auto max-w-[70%]"
                      : "bg-gray-100 text-gray-800 mr-auto max-w-[70%]"
                      }`}
                  >
                    <p>{message.content || "..."}</p>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      {/* other user typing.... */}
      <div className="ml-3 h-5 flex items-center">
        {typingEventState.typingStatus === 'start' && typingEventState.userId !== userId as unknown as string && (
          <div className="relative bottom-3 left-3">
            <div className="px-5 py-2 bg-white border border-gray-200 rounded-xl shadow-sm w-fit">
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.3s]" />             </div>
            </div>
          </div>
        )}
      </div>

      {/* Typing area */}
      <div className="border-t border-gray-300 p-4">
        <div className="flex items-center gap-3">
          <Textarea
            value={draftMessage}
            placeholder="Type your message..."
            className="min-h-[44px] resize-none max-h-[120px]"
            aria-label="Type your message"
            onChange={(e) => {
              handleTyping(e)
            }}
          />

          <Button className="h-[44px] bg-brand px-6 text-brand-foreground hover:bg-brand/90 hover:bg-gray-300 cursor-pointer"
            onClick={() => {
              handleSendingMessage()
              setDraftMessage("")
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
