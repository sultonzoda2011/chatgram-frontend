import { useQuery } from '@tanstack/react-query'
import { getChatList } from '../../api/chatApi'
import { getUsers } from '../../api/userApi'
import type { IChatsResponse } from '../../types/chat'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Sidebar = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const {
    data: dataChats,
    isLoading: isLoadingChats,
    isError: isErrorChats,
  } = useQuery<IChatsResponse>({
    queryKey: ['chatList'],
    queryFn: getChatList,
  })

  const {
    data: dataUsers,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useQuery<IChatsResponse>({
    queryKey: ['users', query],
    queryFn: () => getUsers(query),
    enabled: query.length > 0,
  })

  if (isLoadingChats || (query.length > 0 && isLoadingUsers))
    return <div className="p-4 text-sm text-gray-500">Загрузка...</div>

  if (isErrorChats || (query.length > 0 && isErrorUsers))
    return <div className="p-4 text-sm text-red-500">Ошибка загрузки</div>

  const chatsToRender = query.length > 0 ? dataUsers?.data : dataChats?.data

  return (
    <div className={`${isOpen ? 'w-80' : 'w-30'} border-r bg-black flex flex-col`}>
      <div className="p-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск пользователей..."
          className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {chatsToRender?.length ? (
          chatsToRender.map((chat) => (
            <Link
              to={`chat/${chat.id}`}
              key={chat.id}
              className="flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-900 transition border-b"
            >
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-gray-900 truncate">{chat.fullname}</p>
                  <span className="text-xs text-gray-400">{chat.date}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.last_message}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-4 text-sm text-gray-500">
            {query.length > 0 ? 'Пользователи не найдены' : 'Чаты пусты'}
          </div>
        )}
      </div>

      <button onClick={() => setIsOpen(!isOpen)} className="p-2 m-2 bg-gray-700 text-white rounded">
        {isOpen ? 'Свернуть' : 'Развернуть'}
      </button>
    </div>
  )
}

export default Sidebar
