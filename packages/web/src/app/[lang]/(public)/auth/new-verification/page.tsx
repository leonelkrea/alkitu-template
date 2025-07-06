'use client';

import { NewVerificationForm } from '@/components/custom/auth/forms/new-verification-form';
import { AuthCardWrapper } from '@/components/custom/auth/card/auth-card-wrapper';
import { useTranslations } from '@/context/TranslationContext';

export default function NewVerificationPage() {
  const t = useTranslations();

  return (
    <AuthCardWrapper
      headerLabel="Email Verification"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <NewVerificationForm />
    </AuthCardWrapper>
  );
}
