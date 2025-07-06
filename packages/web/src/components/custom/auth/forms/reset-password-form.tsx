'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/context/TranslationContext';
import { FormError } from '@/components/shared/messages/form-error';
import { FormSuccess } from '@/components/shared/messages/form-success';
import { getCurrentLocalizedRoute } from '@/lib/locale';

export const ResetPasswordForm = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setSuccess(
        t('auth.resetPassword.success', {}, 'auth') ||
          'Password reset email sent successfully!',
      );

      // Redirect to verify request page with proper locale
      setTimeout(() => {
        const localizedVerifyRoute = getCurrentLocalizedRoute(
          '/auth/verify-request',
          pathname,
        );
        window.location.href = localizedVerifyRoute;
      }, 2000);
    } catch (err: any) {
      setError(
        err.message ||
          t('auth.resetPassword.error', {}, 'auth') ||
          'Failed to send reset email',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('auth.login.email')}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.login.email')}
          required
          disabled={isLoading}
        />
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t('Common.general.loading') : 'Send Reset Email'}
      </Button>
    </form>
  );
};
