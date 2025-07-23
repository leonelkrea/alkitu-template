'use client';

import Link from 'next/link';
import { useTranslations } from '@/context/TranslationContext';
import { Typography } from '@/components/atomic-design/atoms/typography';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/atomic-design/atoms/icons/Icon';
import { cn } from '@/lib/utils';

const settingsOptions = [
  {
    title: 'Theme Configuration',
    description: 'Customize your application colors and appearance',
    href: '/dashboard/settings/themes',
    icon: 'Palette' as const,
  },
  {
    title: 'Chatbot Settings',
    description: 'Configure chatbot behavior and appearance',
    href: '/dashboard/settings/chatbot',
    icon: 'Bot' as const,
  },
  {
    title: 'General Settings',
    description: 'Application preferences and configuration',
    href: '/dashboard/settings/general',
    icon: 'Settings' as const,
  },
];

export default function SettingsPage() {
  const t = useTranslations('dashboard.settings');

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h1">
          Settings
        </Typography>
        <Typography variant="p">
          Manage your application preferences and configuration
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsOptions.map((option) => (
          <Link key={option.href} href={option.href}>
            <Card
              className={cn(
                'p-6 h-full transition-all duration-200',
                'hover:shadow-md hover:scale-[1.02] cursor-pointer',
                'border-2 hover:border-primary/20',
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                  <Icon name={option.icon} size="md" color="primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">
                    {option.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
