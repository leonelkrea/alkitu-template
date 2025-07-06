'use client';

import { useTranslations } from '@/context/TranslationContext';

export default function SettingsPage() {
  const t = useTranslations('dashboard.settings');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
