import { createContext } from 'react';
import type { WebSocketContextType } from '../../types/websocket';

export const WebSocketContext = createContext<WebSocketContextType | null>(null);
