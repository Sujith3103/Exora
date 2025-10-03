import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'

const ComposeNewMessage = () => {
  const [toUser, setToUser] = useState('')
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (!toUser || !message) return
    // Here you can send the data to the backend
    console.log('Sending message to:', toUser)
    console.log('Message:', message)
    // Reset fields after send
    setToUser('')
    setMessage('')
  }

  const isSendDisabled = !toUser.trim() || !message.trim()

  return (
    <div className='mt-15'>
      <div className='flex items-center'>
        <p className='text-2xl font-semibold'>New Message</p>
        <Button
          className='bg-purple-500 w-30 ml-auto rounded-sm h-10'
          disabled={isSendDisabled}
          onClick={handleSend}
        >
          Send
        </Button>
      </div>

      <div className="flex gap-2 items-center mt-5">
        <span>To:</span>
        <Input
          value={toUser}
          onChange={(e) => setToUser(e.target.value)}
          className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-1 focus-visible:border-black border-1 rounded-sm border-gray-400"
          placeholder='Type a User’s Name'
        />
      </div>

      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mt-7 w-full border-1 border-gray-400 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-1 focus-visible:border-black rounded-sm min-h-70"
        placeholder="Type your message..."
      />
    </div>
  )
}

export default ComposeNewMessage
