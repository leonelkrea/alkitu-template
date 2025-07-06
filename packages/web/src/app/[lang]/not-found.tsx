'use client';

import { useTranslations } from '@/context/TranslationContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl font-bold text-muted-foreground">404</div>
        <h1 className="text-2xl font-bold">{t('NotFound.title')}</h1>
        <p className="text-muted-foreground">{t('NotFound.description')}</p>
        <Button asChild>
          <Link href="/">{t('Common.general.home')}</Link>
        </Button>
      </div>
    </div>
  );
}
