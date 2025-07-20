'use client';

import { useTranslations } from '@/context/TranslationContext';
import { Button } from '@/components/adapters/Button';
import { Typography } from '@/components/adapters/Typography';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { NotificationAnalytics } from '@/components/notifications/notification-analytics';

// Test user ID - En una aplicación real, esto vendría de la sesión del usuario
const TEST_USER_ID = '6861ea1a1c0cf932169adce4';

export default function NotificationAnalyticsPage() {
  const t = useTranslations('notifications');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild migrated={true}>
          <Link
            href="/dashboard/notifications"
            className="flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('analytics.back')}
          </Link>
        </Button>
        <div>
          <Typography variant="h1" className="text-3xl font-bold" migrated={true}>{t('analytics.title')}</Typography>
          <Typography variant="body" className="text-muted-foreground mt-1" migrated={true}>
            {t('analytics.description')}
          </Typography>
        </div>
      </div>

      {/* Analytics Component */}
      <NotificationAnalytics userId={TEST_USER_ID} />
    </div>
  );
}
