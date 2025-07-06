export interface Translations {
  [key: string]: string | Translations;
}

export type Locale = 'en' | 'es';

export interface TranslationsProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
  initialTranslations: Translations;
}