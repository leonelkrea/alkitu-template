'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/context/TranslationContext';
import { FormError } from '@/components/shared/messages/form-error';
import { FormSuccess } from '@/components/shared/messages/form-success';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

export const LoginForm = () => {
  const t = useTranslations();
  const { redirectAfterLogin } = useAuthRedirect();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use Next.js API route instead of direct backend call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setSuccess(t('auth.login.success') || 'Login successful!');

      // Remove client-side cookie setting - API route handles httpOnly cookies
      // The /api/auth/login route already sets the httpOnly cookies properly

      // Remove insecure localStorage usage
      localStorage.removeItem('user');

      // Add a small delay to ensure cookies are set before redirect
      setTimeout(() => {
        redirectAfterLogin();
      }, 100);
    } catch (err: any) {
      setError(err.message || t('auth.login.error') || 'Login failed');
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

      <div className="space-y-2">
        <Label htmlFor="password">{t('auth.login.password')}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.login.password')}
          required
          disabled={isLoading}
        />
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t('Common.general.loading') : t('auth.login.submit')}
      </Button>
    </form>
  );
};
