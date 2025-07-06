import './globals.css';
import { Providers } from '../../components/providers/Providers';
import { cn, inter } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
// import { Analytics } from '@vercel/analytics/react';
// import { SpeedInsights } from '@vercel/speed-insights/next';
import esTranslations from '../../locales/es/common.json';
import enTranslations from '../../locales/en/common.json';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'es') as 'en' | 'es';
  const translations = locale === 'en' ? enTranslations : esTranslations;
  console.log('layout.tsx - Server Side Locale:', locale);
  console.log('layout.tsx - Server Side Translations:', translations);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <Providers initialLocale={locale} initialTranslations={translations}>
          <main
            className={cn(
              'min-h-screen bg-background font-sans antialiased w-full flex flex-col overflow-x-hidden',
              inter.className,
            )}
          >
            {children}
            <Toaster />
          </main>
          {/* <Analytics /> */}
          {/* <SpeedInsights /> */}
        </Providers>
      </body>
    </html>
  );
}
