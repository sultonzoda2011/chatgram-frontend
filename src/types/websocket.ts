export interface WebSocketContextType {
    socket: WebSocket | null;
    isConnected: boolean;
    sendMessage: (content: string, toUserId: string) => void;
    sendTyping: (toUserId: string, isTyping: boolean) => void;
}
