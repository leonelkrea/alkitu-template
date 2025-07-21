'use client';

import { useTranslations } from '@/context/TranslationContext';
import { Button } from '@/components/adapters/Button';
import { Typography } from '@/components/adapters/Typography';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6 max-w-md">
        <Typography variant="h1" className="text-6xl font-bold text-muted-foreground" migrated={true}>404</Typography>
        <Typography variant="h1" className="text-2xl font-bold" migrated={true}>{t('NotFound.title')}</Typography>
        <Typography variant="p" className="text-muted-foreground" migrated={true}>{t('NotFound.description')}</Typography>
        <Button asChild migrated={true}>
          <Link href="/">{t('Common.general.home')}</Link>
        </Button>
      </div>
    </div>
  );
}
