import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotificationCount } from '../use-notification-count';

// Mock the dependencies
vi.mock('../use-websocket', () => ({
  useWebSocket: vi.fn(() => ({
    connected: false,
  })),
}));

vi.mock('@/lib/trpc', () => ({
  trpcReact: {
    notification: {
      getUnreadCount: {
        useQuery: vi.fn(),
      },
    },
  },
}));

const mockUseQuery = vi.fn();
const mockRefetch = vi.fn();
const mockUseWebSocket = vi.fn();

describe('useNotificationCount', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Setup default mocks
    mockUseQuery.mockReturnValue({
      data: { count: 5 },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    mockUseWebSocket.mockReturnValue({
      connected: false,
    });

    // Apply mocks to the already mocked modules
    const trpcModule = await import('@/lib/trpc');
    const websocketModule = await import('../use-websocket');
    
    (trpcModule.trpcReact.notification.getUnreadCount.useQuery as any) = mockUseQuery;
    (websocketModule.useWebSocket as any).mockImplementation(mockUseWebSocket);
  });

  it('should return initial count from API', async () => {
    const { result } = renderHook(() =>
      useNotificationCount({ userId: 'user-1' })
    );

    await waitFor(() => {
      expect(result.current.count).toBe(5);
    });
  });

  it('should return loading state', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    });

    const { result } = renderHook(() =>
      useNotificationCount({ userId: 'user-1' })
    );

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle error state', () => {
    const error = new Error('API Error');
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error,
      refetch: mockRefetch,
    });

    const { result } = renderHook(() =>
      useNotificationCount({ userId: 'user-1' })
    );

    expect(result.current.error).toBe(error);
  });

  it('should increment count optimistically', async () => {
    const { result } = renderHook(() =>
      useNotificationCount({ userId: 'user-1' })
    );

    await waitFor(() => {
      expect(result.current.count).toBe(5);
    });

    act(() => {
      result.current.incrementCount(2);
    });

    expect(result.current.count).toBe(7);
  });

  it('should decrement count optimistically', async () => {
    const { result } = renderHook(() =>
      useNotificationCount({ userId: 'user-1' })
    );

    await waitFor(() => {
      expect(result.current.count).toBe(5);
    });

    act(() => {
      result.current.decrementCount(2);
    });

    expect(result.current.count).toBe(3);
  });

  it('should not decrement below 0', async () => {
    mockUseQuery.mockReturnValue({
      data: { count: 1 },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { result } = renderHook(() =>
      useNotificationCount({ userId: 'user-1' })
    );

    await waitFor(() => {
      expect(result.current.count).toBe(1);
    });

    act(() => {
      result.current.decrementCount(5);
    });

    expect(result.current.count).toBe(0);
  });

  it('should reset count', async () => {
    const { result } = renderHook(() =>
      useNotificationCount({ userId: 'user-1' })
    );

    await waitFor(() => {
      expect(result.current.count).toBe(5);
    });

    act(() => {
      result.current.resetCount();
    });

    expect(result.current.count).toBe(0);
  });

  it('should update count manually', async () => {
    const { result } = renderHook(() =>
      useNotificationCount({ userId: 'user-1' })
    );

    await waitFor(() => {
      expect(result.current.count).toBe(5);
    });

    act(() => {
      result.current.updateCount(10);
    });

    expect(result.current.count).toBe(10);
  });

  it('should be disabled when enabled is false', () => {
    const { result } = renderHook(() =>
      useNotificationCount({ userId: 'user-1', enabled: false })
    );

    expect(mockUseQuery).toHaveBeenCalledWith(
      { userId: 'user-1' },
      expect.objectContaining({
        enabled: false,
      })
    );
  });

  it('should be disabled when userId is empty', () => {
    const { result } = renderHook(() =>
      useNotificationCount({ userId: '' })
    );

    expect(mockUseQuery).toHaveBeenCalledWith(
      { userId: '' },
      expect.objectContaining({
        enabled: false,
      })
    );
  });

  it('should use longer refetch interval when WebSocket is connected', () => {
    mockUseWebSocket.mockReturnValue({
      connected: true,
    });

    const { result } = renderHook(() =>
      useNotificationCount({ userId: 'user-1' })
    );

    expect(mockUseQuery).toHaveBeenCalledWith(
      { userId: 'user-1' },
      expect.objectContaining({
        refetchInterval: 60000, // 1 minute when connected
      })
    );
  });

  it('should use default refetch interval when WebSocket is not connected', () => {
    mockUseWebSocket.mockReturnValue({
      connected: false,
    });

    const { result } = renderHook(() =>
      useNotificationCount({ userId: 'user-1', refetchInterval: 30000 })
    );

    expect(mockUseQuery).toHaveBeenCalledWith(
      { userId: 'user-1' },
      expect.objectContaining({
        refetchInterval: 30000, // Default when not connected
      })
    );
  });

  it('should return WebSocket connection status', () => {
    mockUseWebSocket.mockReturnValue({
      connected: true,
    });

    const { result } = renderHook(() =>
      useNotificationCount({ userId: 'user-1' })
    );

    expect(result.current.connected).toBe(true);
  });
});