'use client';
import ReactQueryProvider from '@/context/ReactQueryProvider';
import { ThemeContextProvider } from './ThemeContextProvider';
import { TranslationsProvider } from '@/context/TranslationContext';
import { TrpcProvider } from './TrpcProvider';
import { Translations, TranslationsProviderProps } from '@/types/translations';

interface ProvidersProps {
  children: React.ReactNode;
  initialLocale: 'en' | 'es';
  initialTranslations: Translations;
}

export function Providers({
  children,
  initialLocale,
  initialTranslations,
}: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <ThemeContextProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TranslationsProvider
          initialLocale={initialLocale}
          initialTranslations={initialTranslations}
        >
          <TrpcProvider>{children}</TrpcProvider>
        </TranslationsProvider>
      </ThemeContextProvider>
    </ReactQueryProvider>
  );
}
