export interface RouteTranslation {
  id: string;
  translations: {
    en: string;
    es: string;
  };
}

export interface RouteTranslations {
  [key: string]: RouteTranslation;
}