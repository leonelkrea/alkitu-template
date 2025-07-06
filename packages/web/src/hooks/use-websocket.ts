'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketProps {
  userId: string;
  token?: string;
  enabled?: boolean;
  onNewNotification?: (notification: any) => void;
  onCountUpdate?: () => void;
  onConnectionChange?: (connected: boolean) => void;
}

interface WebSocketState {
  connected: boolean;
  socket: Socket | null;
  error: string | null;
  reconnectAttempts: number;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000; // 2 seconds

export function useWebSocket({
  userId,
  token,
  enabled = true,
  onNewNotification,
  onCountUpdate,
  onConnectionChange,
}: UseWebSocketProps) {
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    socket: null,
    error: null,
    reconnectAttempts: 0,
  });

  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!enabled || !userId || socketRef.current?.connected) {
      return;
    }

    const websocketUrl =
      process.env.NODE_ENV === 'production'
        ? '/notifications'
        : 'http://localhost:3001/notifications';

    console.log('Connecting to WebSocket:', websocketUrl);

    const socket = io(websocketUrl, {
      auth: {
        token: token || 'mock-token', // In production, use real JWT token
      },
      transports: ['websocket', 'polling'],
      upgrade: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: RECONNECT_DELAY,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
      setState((prev) => ({
        ...prev,
        connected: true,
        error: null,
        reconnectAttempts: 0,
      }));
      onConnectionChange?.(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setState((prev) => ({
        ...prev,
        connected: false,
        error: `Disconnected: ${reason}`,
      }));
      onConnectionChange?.(false);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setState((prev) => ({
        ...prev,
        connected: false,
        error: error.message,
        reconnectAttempts: prev.reconnectAttempts + 1,
      }));
    });

    // Notification events
    socket.on('notification:new', (notification) => {
      console.log('New notification received:', notification);
      onNewNotification?.(notification);
      onCountUpdate?.();
    });

    socket.on('notification:count_updated', () => {
      console.log('Notification count updated');
      onCountUpdate?.();
    });

    socket.on('notification_read', () => {
      console.log('Notification marked as read');
      onCountUpdate?.();
    });

    socket.on('connection:confirmed', (data) => {
      console.log('Connection confirmed:', data);
    });

    // Subscribe to notifications
    socket.emit('notification:subscribe');

    setState((prev) => ({ ...prev, socket }));
  }, [
    enabled,
    userId,
    token,
    onNewNotification,
    onCountUpdate,
    onConnectionChange,
  ]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('Disconnecting WebSocket');
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setState({
      connected: false,
      socket: null,
      error: null,
      reconnectAttempts: 0,
    });
  }, []);

  const reconnect = () => {
    disconnect();

    if (state.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log(
          `Attempting to reconnect (${state.reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`,
        );
        connect();
      }, RECONNECT_DELAY);
    }
  };

  // Initialize connection
  useEffect(() => {
    if (enabled && userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, userId, token, connect]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      // Don't call disconnect here to avoid loops
    };
  }, []);

  return {
    connected: state.connected,
    socket: state.socket,
    error: state.error,
    reconnectAttempts: state.reconnectAttempts,
    connect,
    disconnect,
    reconnect,
  };
}
