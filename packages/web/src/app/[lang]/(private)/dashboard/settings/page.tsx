'use client';

import { useTranslations } from '@/context/TranslationContext';
import { Typography } from '@/components/adapters/Typography';

export default function SettingsPage() {
  const t = useTranslations('dashboard.settings');

  return (
    <div>
      <Typography variant="h1" migrated={true}>{t('title')}</Typography>
      <Typography variant="p" migrated={true}>{t('description')}</Typography>
    </div>
  );
}
