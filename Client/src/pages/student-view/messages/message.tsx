import { useGetAllMessage } from '@/components/student-view/communication/hooks/useGetAllMessage'
import ChatArea from '@/components/student-view/communication/messages/chat-area/chatArea'
import ComposeNewMessage from '@/components/student-view/communication/messages/compose-message/composeNewMessage'
import ConversationCard from '@/components/student-view/communication/messages/conversationCard/conversationList'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem,  SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Conversation } from '@/config/config'
import { Search } from 'lucide-react'
import  { useEffect, useState } from 'react'

type MessageFilters = {
  isUnred: boolean
  isImportant: boolean
  isAnswered: boolean
  isAutomated: boolean
}

const filterOptions = [
  { key: 'isUnred', label: 'Unread' },
  { key: 'isImportant', label: 'Important' },
  { key: 'isAnswered', label: 'Not Answered' },
  { key: 'isAutomated', label: 'Show Automated Messages' },
];

const Message = () => {


  const { data: messagesData, isLoading } = useGetAllMessage()

  const [isComposingMessage, setIsComposingMessage] = useState(false)

  const [messageFilters, setMessageFilters] = useState<MessageFilters>({
    isAnswered: false,
    isAutomated: false,
    isImportant: false,
    isUnred: false
  })

  useEffect(() => {
    console.log(messagesData)
  },[messagesData])

  return (
    <div className='lg:pt-5 lg:p-15 p-5 w-full h-full flex flex-col'>
      <span className='text-3xl font-semibold font-display tracking-wide'>Messages</span>

      <div className="grid gap-5 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-center mt-6">
        {filterOptions.map((item) => (
          <div key={item.key} className="flex items-center gap-3">
            <Checkbox
              id={item.key}
              className="border-2 rounded-none border-black cursor-pointer"
              checked={messageFilters[item.key as keyof MessageFilters]}
              onCheckedChange={(checked) =>
                setMessageFilters((prev) => ({
                  ...prev,
                  [item.key]: !!checked,
                }))
              }
            />
            <Label className="font-normal cursor-pointer" htmlFor={item.key}>{item.label}</Label>
          </div>
        ))}

        {/* Sort dropdown */}
        <Select>
          <SelectTrigger className="w-full border-none hover:bg-gray-100 cursor-pointer">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Compose button */}
        <Button
          variant={"outline"}
          className="border-violet-500 text-purple-700 rounded-sm w-full h-11 cursor-pointer"
          onClick={() => setIsComposingMessage(prev => !prev)}
        >
          {
            !isComposingMessage ? 'Compose' : 'Cancel'
          }
        </Button>
      </div>

      {
        isComposingMessage ? (
          <ComposeNewMessage setIsComposingMessage={setIsComposingMessage}/>
        ) : (
          <Card className='rounded-none p-0 gap-0 mt-3 flex-1 flex flex-row border-gray-300'>

            {/* left side */}
            <div className='sm:w-1/3 bg-red- overflow-y-auto border-r-1'>
              <div className='w-full flex gap-1 border-b-1 border-gray-300'>

                <input className='w-full pl-2 caret-gray-400'
                  placeholder='Search for a senders name'
                />


                <Button variant={'outline'} className='ml-auto rounded-none '>
                  <Search />
                </Button>
              </div>

              {!isLoading && (
                <>
                  {messagesData.data.map((message: Conversation) => (
                    <ConversationCard
                      key={message.id}
                      conversation={message}
                    />
                  ))}
                </>
              )}  

            </div>

            {/* right side */}
            <div className='overflow-y-auto'>
              <ChatArea />
            </div>
          </Card>
        )
      }

    </div>
  )
}

export default Message
