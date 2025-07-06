'use client';

import { RegisterForm } from '@/components/custom/auth/forms/register-form';
import { AuthCardWrapper } from '@/components/custom/auth/card/auth-card-wrapper';
import { useTranslations } from '@/context/TranslationContext';

export default function RegisterPage() {
  const t = useTranslations();

  return (
    <AuthCardWrapper
      headerLabel={t('auth.register.title')}
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
      showSocial
    >
      <RegisterForm />
    </AuthCardWrapper>
  );
}
