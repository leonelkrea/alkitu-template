'use client';

import { AuthCardWrapper } from '@/components/custom/auth/card/auth-card-wrapper';
import { useTranslations } from '@/context/TranslationContext';
import { Typography } from '@/components/adapters/Typography';

export default function AuthErrorPage() {
  const t = useTranslations();

  return (
    <AuthCardWrapper
      headerLabel="Authentication Error"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <Typography variant="p" className="text-destructive text-center" migrated={true}>
        Something went wrong during authentication. Please try again.
      </Typography>
    </AuthCardWrapper>
  );
}
