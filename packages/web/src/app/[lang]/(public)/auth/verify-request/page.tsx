'use client';

import { AuthCardWrapper } from '@/components/custom/auth/card/auth-card-wrapper';
import { useTranslations } from '@/context/TranslationContext';
import { Typography } from '@/components/atomic-design/atoms/typography';

export default function VerifyRequestPage() {
  const t = useTranslations();

  return (
    <AuthCardWrapper
      headerLabel={t('auth.verifyRequest.title')}
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <Typography variant="p" className="text-center text-muted-foreground">
        {t('auth.verifyRequest.message1')}
        <br />
        {t('auth.verifyRequest.message2')}
      </Typography>
    </AuthCardWrapper>
  );
}
