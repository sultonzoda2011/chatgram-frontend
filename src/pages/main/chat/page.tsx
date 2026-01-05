import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMessage, sendMessage } from '../../../api/chatApi'
import { useParams } from 'react-router-dom'
import type { IMessageResponse } from '../../../types/chat'
import { useState } from 'react'

const Chat = () => {
  const queryClient = useQueryClient()
  const { id } = useParams()
  const [message, setMessage] = useState('')

  const { data } = useQuery<IMessageResponse>({
    queryKey: ['chat', id],
    queryFn: () => {
      return getMessage(Number(id))
    },
    enabled: !!id,
  })

  const { mutate } = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setMessage('')

      queryClient.invalidateQueries({ queryKey: ['chat', id] })

      queryClient.invalidateQueries({ queryKey: ['chatList'] })
    },
  })

  return (
    <div>
      {data?.data.map((msg) => (
        <div key={msg.id} style={{ marginBottom: '10px' }}>
          {msg.from_user_id} <b>To:</b> {msg.to_user_id} <br />
          <span>{msg.content}</span> <br />
          <small>{new Date(msg.date).toLocaleString()}</small>
        </div>
      ))}
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => mutate({ toUserId: Number(id), content: message })}>Send</button>
    </div>
  )
}

export default Chat
