import { renderHook, act } from '@testing-library/react';
import { usePushNotifications } from '../use-push-notifications';
import { toast } from 'sonner';
import { vi, beforeEach, describe, it, expect } from 'vitest';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock global fetch
global.fetch = vi.fn();

// Mock service worker and notification APIs
const mockServiceWorkerRegistration = {
  pushManager: {
    getSubscription: vi.fn(),
    subscribe: vi.fn(),
  },
};

const mockPushSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint',
  getKey: vi.fn(),
  unsubscribe: vi.fn(),
};

// Mock navigator APIs
Object.defineProperty(global, 'navigator', {
  value: {
    serviceWorker: {
      register: vi.fn(),
      getRegistration: vi.fn(),
    },
  },
  writable: true,
});

Object.defineProperty(global, 'window', {
  value: {
    PushManager: vi.fn(),
    Notification: {
      permission: 'default',
      requestPermission: vi.fn(),
    },
    atob: vi.fn((str) => str),
    btoa: vi.fn((str) => str),
  },
  writable: true,
});

// Mock Uint8Array
Object.defineProperty(global, 'Uint8Array', {
  value: vi.fn().mockImplementation((length) => new Array(length).fill(0)),
  writable: true,
});

describe('usePushNotifications', () => {
  const mockUserId = 'test-user-123';
  const mockVapidKey = 'test-vapid-key';

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset global mocks
    (global.fetch as any).mockClear();
    (navigator.serviceWorker.register as any).mockClear();
    (navigator.serviceWorker.getRegistration as any).mockClear();

    // Reset notification permission using the same reference
    Object.defineProperty(window.Notification, 'permission', {
      writable: true,
      value: 'default',
    });
    Object.defineProperty(global.Notification, 'permission', {
      writable: true,
      value: 'default',
    });

    // Reset and set up the requestPermission mock
    window.Notification.requestPermission = vi.fn().mockResolvedValue('granted');
    global.Notification.requestPermission = vi.fn().mockResolvedValue('granted');

    // Set default return values
    (navigator.serviceWorker.register as any).mockResolvedValue(
      mockServiceWorkerRegistration,
    );
    (navigator.serviceWorker.getRegistration as any).mockResolvedValue(
      mockServiceWorkerRegistration,
    );
    (
      mockServiceWorkerRegistration.pushManager.getSubscription as any
    ).mockResolvedValue(null);
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  describe('initialization', () => {
    it('should detect browser support correctly', () => {
      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          vapidPublicKey: mockVapidKey,
        }),
      );

      expect(result.current.isSupported).toBe(true);
    });

    it('should detect lack of browser support', () => {
      // Temporarily remove service worker support
      const originalServiceWorker = navigator.serviceWorker;
      delete (navigator as any).serviceWorker;

      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          vapidPublicKey: mockVapidKey,
        }),
      );

      expect(result.current.isSupported).toBe(false);

      // Restore service worker
      (navigator as any).serviceWorker = originalServiceWorker;
    });

    it('should set initial permission status', () => {
      Object.defineProperty(window.Notification, 'permission', {
        writable: true,
        value: 'granted',
      });
      Object.defineProperty(global.Notification, 'permission', {
        writable: true,
        value: 'granted',
      });

      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          vapidPublicKey: mockVapidKey,
        }),
      );

      expect(result.current.permission).toBe('granted');
    });
  });

  describe('permission handling', () => {
    it('should request permission successfully', async () => {
      (window.Notification.requestPermission as any).mockImplementation(() => {
        Object.defineProperty(window.Notification, 'permission', {
          writable: true,
          value: 'granted',
        });
        Object.defineProperty(global.Notification, 'permission', {
          writable: true,
          value: 'granted',
        });
        return Promise.resolve('granted');
      });

      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          vapidPublicKey: mockVapidKey,
        }),
      );

      let permissionResult;
      await act(async () => {
        permissionResult = await result.current.requestPermission();
      });

      expect(permissionResult).toBe(true);
      expect(result.current.permission).toBe('granted');
      expect(toast.success).toHaveBeenCalledWith('Push notifications enabled!');
    });

    it('should handle permission denial', async () => {
      // Clear and reset the mock completely
      vi.clearAllMocks();
      window.Notification.requestPermission = vi.fn().mockResolvedValue('denied');
      global.Notification.requestPermission = vi.fn().mockResolvedValue('denied');

      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          vapidPublicKey: mockVapidKey,
        }),
      );

      let permissionResult;
      await act(async () => {
        permissionResult = await result.current.requestPermission();
      });

      expect(permissionResult).toBe(false);
      expect(result.current.permission).toBe('denied');
      expect(toast.error).toHaveBeenCalledWith('Push notifications denied');
    });
  });

  describe('subscription management', () => {
    beforeEach(() => {
      (window.Notification.requestPermission as any).mockResolvedValue(
        'granted',
      );
      (mockPushSubscription.getKey as any).mockReturnValue(new ArrayBuffer(8));
    });

    it('should subscribe to push notifications successfully', async () => {
      // Mock permission as granted
      (window.Notification.requestPermission as any).mockImplementation(() => {
        Object.defineProperty(window.Notification, 'permission', {
          writable: true,
          value: 'granted',
        });
        Object.defineProperty(global.Notification, 'permission', {
          writable: true,
          value: 'granted',
        });
        return Promise.resolve('granted');
      });
      
      (
        mockServiceWorkerRegistration.pushManager.subscribe as any
      ).mockResolvedValue(mockPushSubscription);

      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          vapidPublicKey: mockVapidKey,
        }),
      );

      await act(async () => {
        await result.current.subscribe();
      });

      expect(result.current.isSubscribed).toBe(true);
      expect(result.current.subscription).toBe(mockPushSubscription);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/notifications/push/subscribe',
        expect.any(Object),
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Successfully subscribed to push notifications!',
      );
    });

    it('should handle existing subscription', async () => {
      (
        mockServiceWorkerRegistration.pushManager.getSubscription as any
      ).mockResolvedValue(mockPushSubscription);

      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          vapidPublicKey: mockVapidKey,
        }),
      );

      await act(async () => {
        await result.current.subscribe();
      });

      expect(result.current.isSubscribed).toBe(true);
      expect(
        mockServiceWorkerRegistration.pushManager.subscribe,
      ).not.toHaveBeenCalled();
    });

    it('should unsubscribe from push notifications', async () => {
      (mockPushSubscription.unsubscribe as any).mockResolvedValue(true);
      
      // Mock permission as granted for subscription
      (window.Notification.requestPermission as any).mockImplementation(() => {
        Object.defineProperty(window.Notification, 'permission', {
          writable: true,
          value: 'granted',
        });
        Object.defineProperty(global.Notification, 'permission', {
          writable: true,
          value: 'granted',
        });
        return Promise.resolve('granted');
      });

      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          vapidPublicKey: mockVapidKey,
        }),
      );

      // First subscribe
      (
        mockServiceWorkerRegistration.pushManager.subscribe as any
      ).mockResolvedValue(mockPushSubscription);
      await act(async () => {
        await result.current.subscribe();
      });

      // Then unsubscribe
      await act(async () => {
        await result.current.unsubscribe();
      });

      expect(result.current.isSubscribed).toBe(false);
      expect(result.current.subscription).toBe(null);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/notifications/push/unsubscribe',
        expect.any(Object),
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Successfully unsubscribed from push notifications',
      );
    });

    it('should handle subscription errors', async () => {
      const errorMessage = 'Subscription failed';
      (
        mockServiceWorkerRegistration.pushManager.subscribe as any
      ).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          vapidPublicKey: mockVapidKey,
        }),
      );

      await act(async () => {
        await result.current.subscribe();
      });

      expect(result.current.isSubscribed).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to enable push notifications',
      );
    });

    it('should handle missing VAPID key', async () => {
      const { result } = renderHook(() =>
        usePushNotifications({ userId: mockUserId, vapidPublicKey: undefined }),
      );

      await act(async () => {
        await result.current.subscribe();
      });

      expect(result.current.error).toBe('VAPID public key is not configured');
    });
  });

  describe('test notification', () => {
    it('should send test notification when subscribed', async () => {
      // Mock permission as granted for subscription
      (window.Notification.requestPermission as any).mockImplementation(() => {
        Object.defineProperty(window.Notification, 'permission', {
          writable: true,
          value: 'granted',
        });
        Object.defineProperty(global.Notification, 'permission', {
          writable: true,
          value: 'granted',
        });
        return Promise.resolve('granted');
      });
      
      (
        mockServiceWorkerRegistration.pushManager.subscribe as any
      ).mockResolvedValue(mockPushSubscription);

      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          vapidPublicKey: mockVapidKey,
        }),
      );

      // First subscribe to set isSubscribed to true
      await act(async () => {
        await result.current.subscribe();
      });

      await act(async () => {
        await result.current.testNotification();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/notifications/push/test',
        expect.any(Object),
      );
      expect(toast.success).toHaveBeenCalledWith('Test notification sent!');
    });

    it('should show error when not subscribed', async () => {
      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          vapidPublicKey: mockVapidKey,
        }),
      );

      await act(async () => {
        await result.current.testNotification();
      });

      expect(toast.error).toHaveBeenCalledWith(
        'Please subscribe to push notifications first',
      );
    });
  });

  describe('error handling', () => {
    it('should handle service worker registration failure', async () => {
      const errorMessage = 'Service worker registration failed';
      (navigator.serviceWorker.register as any).mockRejectedValue(
        new Error(errorMessage),
      );

      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          vapidPublicKey: mockVapidKey,
        }),
      );

      await act(async () => {
        await result.current.subscribe();
      });

      expect(result.current.error).toContain(errorMessage);
    });

    it('should handle server API failures', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
      });

      (
        mockServiceWorkerRegistration.pushManager.subscribe as any
      ).mockResolvedValue(mockPushSubscription);

      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          vapidPublicKey: mockVapidKey,
        }),
      );

      await act(async () => {
        await result.current.subscribe();
      });

      expect(result.current.error).toBe(
        'Failed to save push subscription to server',
      );
    });
  });

  describe('disabled state', () => {
    it('should not subscribe when disabled', async () => {
      const { result } = renderHook(() =>
        usePushNotifications({
          userId: mockUserId,
          enabled: false,
          vapidPublicKey: mockVapidKey,
        }),
      );

      await act(async () => {
        await result.current.subscribe();
      });

      expect(result.current.isSubscribed).toBe(false);
      expect(
        mockServiceWorkerRegistration.pushManager.subscribe,
      ).not.toHaveBeenCalled();
    });

    it('should not subscribe when userId is missing', async () => {
      const { result } = renderHook(() =>
        usePushNotifications({ userId: '', vapidPublicKey: mockVapidKey }),
      );

      await act(async () => {
        await result.current.subscribe();
      });

      expect(result.current.isSubscribed).toBe(false);
      expect(
        mockServiceWorkerRegistration.pushManager.subscribe,
      ).not.toHaveBeenCalled();
    });
  });
});
