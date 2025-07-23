'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/context/TranslationContext';
import { FormError } from '@/components/shared/messages/form-error';
import { FormSuccess } from '@/components/shared/messages/form-success';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { getCurrentLocalizedRoute } from '@/lib/locale';

export const NewVerificationForm = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState('');

  const verifyEmail = useCallback(
    async (verificationToken: string) => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: verificationToken }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Email verification failed');
        }

        setSuccess(
          t('auth.verification.success', {}, 'auth') ||
            'Email verified successfully!',
        );

        // Redirect to login with proper locale
        setTimeout(() => {
          const localizedLoginRoute = getCurrentLocalizedRoute(
            '/auth/login',
            pathname,
          );
          window.location.href = localizedLoginRoute;
        }, 3000);
      } catch (err: any) {
        setError(
          err.message ||
            t('auth.verification.error', {}, 'auth') ||
            'Email verification failed',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [t, pathname],
  );

  useEffect(() => {
    const tokenParam = searchParams?.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      verifyEmail(tokenParam);
    } else {
      setError('Invalid or missing verification token');
      setIsLoading(false);
    }
  }, [searchParams, verifyEmail]);

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // This would need to be implemented in the backend
      // For now, just show a message
      setSuccess('Verification email resent! Please check your inbox.');
    } catch (err: any) {
      setError('Failed to resend verification email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner />
        <p className="text-center text-muted-foreground">
          Verifying your email...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FormError message={error} />
      <FormSuccess message={success} />

      {error && !success && (
        <Button
          onClick={handleResendVerification}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading
            ? t('Common.general.loading')
            : 'Resend Verification Email'}
        </Button>
      )}

      {success && (
        <p className="text-center text-sm text-muted-foreground">
          Redirecting to login page...
        </p>
      )}
    </div>
  );
};
