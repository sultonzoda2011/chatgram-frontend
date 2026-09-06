import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	Edit,
	Loader2,
	MessageCircle,
	MoreVertical,
	Send,
	Trash2,
	User
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
	deleteMessage,
	getChatList,
	getMessages,
	sendMessage,
	updateMessage
} from '../../../api/chatApi'
import { GroupMembersModal } from '../../../components/chat/group-members-modal'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input/input'
import { getChatSocket } from '../../../lib/socket'
import { cn } from '../../../lib/utils/cn'
import { getJwtFromCookie } from '../../../lib/utils/jwt'
import type { IChatsResponse, IMessageResponse } from '../../../types/chat'

const Chat = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const { id } = useParams()
	const conversationId = Number(id)
	const [message, setMessage] = useState('')
	const [editId, setEditId] = useState<number | null>(null)
	const [isMembersOpen, setIsMembersOpen] = useState(false)
	const scrollRef = useRef<HTMLDivElement>(null)
	const currentUserId = getJwtFromCookie()?.sub

	const { data: chatsData } = useQuery<IChatsResponse>({
		queryKey: ['chatList'],
		queryFn: getChatList
	})
	const { data: messagesData, isLoading: isLoadingMessages } =
		useQuery<IMessageResponse>({
			queryKey: ['chat', id],
			queryFn: () => getMessages(conversationId),
			enabled: Number.isInteger(conversationId) && conversationId > 0
		})
	const conversation = chatsData?.data.find(chat => chat.id === conversationId)

	useEffect(() => {
		getChatSocket()?.emit('conversation:join', { conversationId })
	}, [conversationId])
	useEffect(() => {
		if (scrollRef.current)
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight
	}, [messagesData])

	const refresh = () => {
		queryClient.invalidateQueries({ queryKey: ['chat', id] })
		queryClient.invalidateQueries({ queryKey: ['chatList'] })
	}
	const { mutate: deleteMutate } = useMutation({
		mutationFn: deleteMessage,
		onSuccess: refresh
	})
	const { mutate: updateMutate } = useMutation({
		mutationFn: updateMessage,
		onSuccess: () => {
			setMessage('')
			setEditId(null)
			refresh()
		}
	})
	const { mutate: send, isPending: isSending } = useMutation({
		mutationFn: sendMessage,
		onSuccess: () => {
			setMessage('')
			refresh()
		}
	})

	const handleSend = (event?: React.FormEvent) => {
		event?.preventDefault()
		if (!message.trim() || isSending || !conversationId) return
		if (editId !== null)
			updateMutate({ messageId: editId, content: message.trim() })
		else send({ conversationId, content: message.trim() })
	}

	const title = conversation?.name || `Conversation #${id}`
	return (
		<div className="relative flex h-full flex-col overflow-hidden bg-background">
			<header className="z-10 flex items-center justify-between border-b border-border/50 bg-card/50 px-4 py-3 backdrop-blur-xl">
				<div className="flex min-w-0 items-center gap-3">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate('/')}
						className="rounded-full lg:hidden"
					>
						<ArrowLeft size={20} />
					</Button>
					<div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-linear-to-br from-primary/20 to-accent/20">
						{conversation?.avatarUrl ? (
							<img
								src={conversation.avatarUrl}
								alt=""
								className="h-full w-full object-cover"
							/>
						) : (
							<span className="text-sm font-bold">
								{title.charAt(0).toUpperCase() || <User size={18} />}
							</span>
						)}
					</div>
					<div className="min-w-0">
						<h2 className="mb-1 truncate text-sm font-bold leading-none">
							{title}
						</h2>
						<p className="text-[10px] font-medium text-green-500">
							{conversation?.type === 'GROUP' &&
								`${conversation.members.length} members`}
						</p>
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full text-muted-foreground"
					disabled={conversation?.type !== 'GROUP'}
					onClick={() => setIsMembersOpen(true)}
					title={t('group.members')}
				>
					<MoreVertical size={18} />
				</Button>
			</header>
			<div
				ref={scrollRef}
				className="flex-1 space-y-4 overflow-y-auto bg-linear-to-b from-transparent to-primary/5 p-4 custom-scrollbar"
			>
				{isLoadingMessages ? (
					<div className="flex h-full items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-primary/50" />
					</div>
				) : messagesData?.data.length ? (
					messagesData.data.map((msg, index) => {
						const isMe = msg.senderId === currentUserId
						const deleted = Boolean(msg.deletedAt)
						return (
							<motion.div
								key={msg.id}
								initial={{ opacity: 0, y: 10, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								transition={{
									duration: 0.2,
									delay: Math.min(index * 0.05, 0.5)
								}}
								className={cn(
									'relative group flex max-w-[85%] items-end gap-2 sm:max-w-[70%]',
									isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'
								)}
							>
								{isMe && !deleted && (
									<div className="absolute -top-3 right-0 hidden items-center gap-1 rounded-full border border-border/50 bg-background/70 px-1.5 py-1 shadow-lg backdrop-blur-md group-hover:flex">
										<button
											onClick={() => {
												setMessage(msg.content)
												setEditId(msg.id)
											}}
											className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-primary hover:text-white"
										>
											<Edit size={14} />
										</button>
										<button
											onClick={() => deleteMutate(msg.id)}
											className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-red-500 hover:text-white"
										>
											<Trash2 size={14} />
										</button>
									</div>
								)}
								<div
									className={cn(
										'rounded-2xl px-4 py-2 text-sm shadow-sm',
										isMe
											? 'rounded-br-none bg-primary text-primary-foreground'
											: 'rounded-bl-none border border-border/50 bg-card'
									)}
								>
									<>
										{conversation?.type === 'GROUP' && !isMe && (
											<p className="mb-1 text-[10px] font-semibold opacity-70">
												{msg.sender.fullname}
											</p>
										)}
										<p
											className={cn(
												'wrap-break-word leading-relaxed',
												deleted && 'italic opacity-60'
											)}
										>
											{deleted ? t('chat.deletedMessage') : msg.content}
										</p>
										<p className="mt-1 text-right text-[8px] font-medium opacity-60">
											{new Date(msg.createdAt).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</p>
									</>
								</div>
							</motion.div>
						)
					})
				) : (
					<div className="flex h-full flex-col items-center justify-center space-y-3 text-muted-foreground opacity-50">
						<MessageCircle size={32} />
						<p className="text-sm font-medium">{t('chat.noMessages')}</p>
					</div>
				)}
			</div>
			<div className="border-t border-border/50 bg-background/80 p-4 backdrop-blur-md">
				<form
					onSubmit={handleSend}
					className="mx-auto flex max-w-4xl items-center gap-3"
				>
					<Input
						type="text"
						value={message}
						onChange={event => setMessage(event.target.value)}
						placeholder={t('chat.typeMessage')}
						className="h-12 rounded-2xl bg-secondary/40"
					/>
					<Button
						type="submit"
						disabled={!message.trim() || isSending}
						size="icon"
						className="h-12 w-12 rounded-2xl"
					>
						{isSending ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : (
							<Send size={18} />
						)}
					</Button>
				</form>
			</div>
			{conversation?.type === 'GROUP' && (
				<GroupMembersModal
					conversation={conversation}
					open={isMembersOpen}
					onClose={() => setIsMembersOpen(false)}
				/>
			)}
		</div>
	)
}

export default Chat
