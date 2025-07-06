'use client';

import { ResetPasswordForm } from '@/components/custom/auth/forms/reset-password-form';
import { AuthCardWrapper } from '@/components/custom/auth/card/auth-card-wrapper';
import { useTranslations } from '@/context/TranslationContext';

export default function ResetPasswordPage() {
  const t = useTranslations();

  return (
    <AuthCardWrapper
      headerLabel="Reset Password"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <ResetPasswordForm />
    </AuthCardWrapper>
  );
}
