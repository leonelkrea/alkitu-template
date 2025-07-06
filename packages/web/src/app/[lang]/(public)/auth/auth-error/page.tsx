'use client';

import { AuthCardWrapper } from '@/components/custom/auth/card/auth-card-wrapper';
import { useTranslations } from '@/context/TranslationContext';

export default function AuthErrorPage() {
  const t = useTranslations();

  return (
    <AuthCardWrapper
      headerLabel="Authentication Error"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <p className="text-destructive text-center">
        Something went wrong during authentication. Please try again.
      </p>
    </AuthCardWrapper>
  );
}
