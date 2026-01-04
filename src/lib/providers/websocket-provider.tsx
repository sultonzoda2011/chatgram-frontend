import { useEffect, useRef, useState, type ReactNode, useCallback } from 'react';
import { getToken } from '../utils/cookie';
import { WebSocketContext } from './websocket-context';

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const reconnectTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    const connect = useCallback(function connectFn() {
        const token = getToken();
        if (!token) return;

        const baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
        const wsUrl = baseUrl.replace(/\/$/, '');
        const url = `${wsUrl}/chat?token=${token}`;

        const ws = new WebSocket(url);

        ws.onopen = () => {
            setIsConnected(true);
            setSocket(ws);
        };

        ws.onclose = () => {
            setIsConnected(false);
            setSocket(null);
            reconnectTimeout.current = setTimeout(connectFn, 3000);
        };

        ws.onerror = () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
            if (socket) socket.close();
        };
    }, [connect, socket]);

    const sendMessage = useCallback((content: string, toUserId: string) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'message',
                content,
                toUserId
            }));
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
