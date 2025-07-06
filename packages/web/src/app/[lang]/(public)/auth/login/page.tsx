'use client';

import { LoginForm } from '@/components/custom/auth/forms/login-form';
import { AuthCardWrapper } from '@/components/custom/auth/card/auth-card-wrapper';
import { useTranslations } from '@/context/TranslationContext';

export default function LoginPage() {
  const t = useTranslations();

  return (
    <AuthCardWrapper
      headerLabel={t('auth.login.title')}
      backButtonLabel="Back to Home"
      backButtonHref="/"
      showSocial
    >
      <LoginForm />
    </AuthCardWrapper>
  );
}
