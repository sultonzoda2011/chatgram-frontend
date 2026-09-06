export function formatChatDate(iso: string) {
    const date = new Date(iso)
    const now = new Date()

    const isToday =
        date.toDateString() === now.toDateString()

    const yesterday = new Date()
    yesterday.setDate(now.getDate() - 1)

    const isYesterday =
        date.toDateString() === yesterday.toDateString()

    if (isToday) {
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    if (isYesterday) {
        return `вчера ${date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        })}`
    }

    return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}
