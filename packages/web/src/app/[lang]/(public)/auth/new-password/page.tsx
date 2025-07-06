'use client';

import { NewPasswordForm } from '@/components/custom/auth/forms/new-password-form';
import { AuthCardWrapper } from '@/components/custom/auth/card/auth-card-wrapper';
import { useTranslations } from '@/context/TranslationContext';

export default function NewPasswordPage() {
  const t = useTranslations();

  return (
    <AuthCardWrapper
      headerLabel="Set New Password"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <NewPasswordForm />
    </AuthCardWrapper>
  );
}
