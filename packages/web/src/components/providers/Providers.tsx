'use client';
import ReactQueryProvider from '@/context/ReactQueryProvider';
import { ThemeContextProvider } from './ThemeContextProvider';
import { TranslationsProvider } from '@/context/TranslationContext';
import { TrpcProvider } from './TrpcProvider';
import { Translations, TranslationsProviderProps } from '@/types/translations';
import { DynamicThemeProvider } from './DynamicThemeProvider';
import { ThemeErrorBoundaryClass } from './ThemeErrorBoundary';
import { TooltipProvider } from '@/components/ui/tooltip';

interface ProvidersProps {
  children: React.ReactNode;
  initialLocale: 'en' | 'es';
  initialTranslations: Translations;
  companyId?: string;
  themeId?: string;
}

export function Providers({
  children,
  initialLocale,
  initialTranslations,
  companyId,
  themeId,
}: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <TrpcProvider>
        <ThemeErrorBoundaryClass>
          <DynamicThemeProvider companyId={companyId} themeId={themeId}>
            <ThemeContextProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <TranslationsProvider
                  initialLocale={initialLocale}
                  initialTranslations={initialTranslations}
                >
                  {children}
                </TranslationsProvider>
              </TooltipProvider>
            </ThemeContextProvider>
          </DynamicThemeProvider>
        </ThemeErrorBoundaryClass>
      </TrpcProvider>
    </ReactQueryProvider>
  );
}
