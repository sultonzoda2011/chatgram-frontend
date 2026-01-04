import { createContext, useContext, useEffect, useRef, useState, type ReactNode, useCallback } from 'react';
import { getToken } from '../utils/cookie';

interface WebSocketContextType {
    socket: WebSocket | null;
    isConnected: boolean;
    sendMessage: (content: string, toUserId: string) => void;
    sendTyping: (toUserId: string, isTyping: boolean) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const reconnectTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    const connect = useCallback(() => {
        const token = getToken();
        if (!token) return;

        const baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
        const wsUrl = baseUrl.replace(/\/$/, '');
        const url = `${wsUrl}/chat?token=${token}`;

        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('✅ WebSocket connected');
            setIsConnected(true);
            setSocket(ws);
        };

        ws.onclose = () => {
            console.log('❌ WebSocket disconnected');
            setIsConnected(false);
            setSocket(null);

            reconnectTimeout.current = setTimeout(connect, 3000);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            ws.close();
        };
    }, []);

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
            if (socket) socket.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sendMessage = useCallback((content: string, toUserId: string) => {

        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'message',
                content,
                toUserId
            }));
        } else {
            console.warn('Socket not open, cannot send message');
        }
    }, [socket]);

    const sendTyping = useCallback((toUserId: string, isTyping: boolean) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'typing',
                toUserId,
                isTyping
            }));
        }
    }, [socket]);

    return (
        <WebSocketContext.Provider value={{ socket, isConnected, sendMessage, sendTyping }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) throw new Error('useWebSocket must be used within WebSocketProvider');
    return context;
}
