import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PushNotificationSettings from '../push-notification-settings';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { TranslationsProvider } from '@/context/TranslationContext';
import { vi, beforeEach, describe, it, expect } from 'vitest';

// Mock the hook
vi.mock('@/hooks/use-push-notifications');

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockUsePushNotifications = usePushNotifications as any;

// Helper function to render component with TranslationsProvider
const renderWithTranslations = (component: React.ReactElement) => {
  const mockTranslations = {
    notifications: {
      preferences: {
        push: {
          browserSettings: 'Browser Push Notifications',
          browserDescription: 'Receive notifications directly in your browser',
          title: 'Browser Push Notifications',
          description: 'Receive notifications directly in your browser',
          status: 'Permission Status',
          subscription: 'Subscription Status',
          default: 'Not Requested',
          granted: 'Granted',
          denied: 'Denied',
          active: 'Active',
          inactive: 'Inactive',
          subscribe: 'Enable Push Notifications',
          unsubscribe: 'Disable Push Notifications',
          testNotification: 'Test Notification',
          blocked: 'Push notifications are blocked.',
          blockedStep1:
            "Click the lock icon in your browser's address bar to enable them.",
          blockedStep2: 'Select "Notifications" from the dropdown.',
          blockedStep3: 'Choose "Allow" and refresh the page.',
          disabledInfo: 'Push notifications are disabled in your preferences.',
        },
      },
    },
  };

  return render(
    <TranslationsProvider
      initialLocale="en"
      initialTranslations={mockTranslations}
    >
      {component}
    </TranslationsProvider>,
  );
};

describe('PushNotificationSettings', () => {
  const defaultProps = {
    userId: 'test-user-123',
    enabled: true,
  };

  const defaultHookReturn = {
    isSupported: true,
    permission: 'default' as NotificationPermission,
    isSubscribed: false,
    isLoading: false,
    subscription: null,
    error: null,
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    testNotification: vi.fn(),
    requestPermission: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePushNotifications.mockReturnValue(defaultHookReturn);
  });

  describe('rendering', () => {
    it('should render the component with default state', () => {
      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(
        screen.getByText('Browser Push Notifications'),
      ).toBeInTheDocument();
      expect(screen.getByText('Permission Status')).toBeInTheDocument();
      expect(screen.getByText('Subscription Status')).toBeInTheDocument();
      expect(screen.getByText('Not Requested')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    it('should show unsupported message when browser does not support push notifications', () => {
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        isSupported: false,
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(
        screen.getByText(
          /Push notifications are not supported in your browser/,
        ),
      ).toBeInTheDocument();
    });

    it('should show granted permission badge when permission is granted', () => {
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        permission: 'granted',
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(screen.getByText('Granted')).toBeInTheDocument();
    });

    it('should show denied permission badge when permission is denied', () => {
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        permission: 'denied',
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(screen.getByText('Denied')).toBeInTheDocument();
    });

    it('should show active subscription badge when subscribed', () => {
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        isSubscribed: true,
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  describe('permission states', () => {
    it('should show permission request alert when permission is default', () => {
      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(
        screen.getByText(
          /To receive push notifications, you need to grant permission/,
        ),
      ).toBeInTheDocument();
    });

    it('should show denied permission help when permission is denied', () => {
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        permission: 'denied',
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(
        screen.getByText(/Push notifications are blocked/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Click the lock icon in your browser's address bar/),
      ).toBeInTheDocument();
    });

    it('should show disabled info when notifications are disabled in preferences', () => {
      renderWithTranslations(
        <PushNotificationSettings {...defaultProps} enabled={false} />,
      );

      expect(
        screen.getByText(/Push notifications are disabled in your preferences/),
      ).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should display error message when there is an error', () => {
      const errorMessage = 'Test error message';
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        error: errorMessage,
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('button interactions', () => {
    it('should call subscribe when enable button is clicked', async () => {
      const mockSubscribe = vi.fn();
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        subscribe: mockSubscribe,
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      const enableButton = screen.getByText('Enable Push Notifications');
      fireEvent.click(enableButton);

      expect(mockSubscribe).toHaveBeenCalled();
    });

    it('should call unsubscribe when disable button is clicked', async () => {
      const mockUnsubscribe = vi.fn();
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        isSubscribed: true,
        unsubscribe: mockUnsubscribe,
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      const disableButton = screen.getByText('Disable Push Notifications');
      fireEvent.click(disableButton);

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('should call requestPermission when request permission button is clicked', async () => {
      const mockRequestPermission = vi.fn();
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        requestPermission: mockRequestPermission,
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      const requestButton = screen.getByText('Request Permission');
      fireEvent.click(requestButton);

      expect(mockRequestPermission).toHaveBeenCalled();
    });

    it('should call testNotification when test button is clicked', async () => {
      const mockTestNotification = vi.fn();
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        isSubscribed: true,
        testNotification: mockTestNotification,
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      const testButton = screen.getByText('Test Notification');
      fireEvent.click(testButton);

      expect(mockTestNotification).toHaveBeenCalled();
    });

    it('should disable buttons when loading', () => {
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        isLoading: true,
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      const enableButton = screen.getByText('Enabling...');
      expect(enableButton).toBeDisabled();
    });

    it('should disable buttons when notifications are disabled in preferences', () => {
      renderWithTranslations(
        <PushNotificationSettings {...defaultProps} enabled={false} />,
      );

      const enableButton = screen.getByText('Enable Push Notifications');
      expect(enableButton).toBeDisabled();

      const requestButton = screen.getByText('Request Permission');
      expect(requestButton).toBeDisabled();
    });
  });

  describe('conditional rendering', () => {
    it('should show enable button when not subscribed', () => {
      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(screen.getByText('Enable Push Notifications')).toBeInTheDocument();
      expect(
        screen.queryByText('Disable Push Notifications'),
      ).not.toBeInTheDocument();
    });

    it('should show disable button when subscribed', () => {
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        isSubscribed: true,
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(
        screen.getByText('Disable Push Notifications'),
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Enable Push Notifications'),
      ).not.toBeInTheDocument();
    });

    it('should show request permission button when permission is default', () => {
      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(screen.getByText('Request Permission')).toBeInTheDocument();
    });

    it('should not show request permission button when permission is granted', () => {
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        permission: 'granted',
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(screen.queryByText('Request Permission')).not.toBeInTheDocument();
    });

    it('should show test button when subscribed', () => {
      mockUsePushNotifications.mockReturnValue({
        ...defaultHookReturn,
        isSubscribed: true,
      });

      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(screen.getByText('Test Notification')).toBeInTheDocument();
    });

    it('should not show test button when not subscribed', () => {
      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(screen.queryByText('Test Notification')).not.toBeInTheDocument();
    });
  });

  describe('information display', () => {
    it('should display informational content about push notifications', () => {
      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(
        screen.getByText('What are push notifications?'),
      ).toBeInTheDocument();
      expect(screen.getByText('Privacy & Control:')).toBeInTheDocument();
      expect(
        screen.getByText(
          /Push notifications allow you to receive real-time alerts/,
        ),
      ).toBeInTheDocument();
    });

    it('should display development note', () => {
      renderWithTranslations(<PushNotificationSettings {...defaultProps} />);

      expect(screen.getByText('Development Note:')).toBeInTheDocument();
      expect(
        screen.getByText(/VAPID keys should be properly configured/),
      ).toBeInTheDocument();
    });
  });
});
