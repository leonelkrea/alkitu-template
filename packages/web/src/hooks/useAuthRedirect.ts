'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const redirectAfterLogin = () => {
    const redirectUrl = searchParams.get('redirect');
    
    // Obtener el idioma actual desde la ruta
    const currentLocale = pathname.split('/')[1] || 'es';
    
    if (redirectUrl) {
      // Decodificar y usar la URL de redirect
      const decodedUrl = decodeURIComponent(redirectUrl);
      console.log('Redirecting to:', decodedUrl);
      
      // Si la URL no tiene idioma, agregarlo
      if (!decodedUrl.startsWith('/es/') && !decodedUrl.startsWith('/en/')) {
        router.push(`/${currentLocale}${decodedUrl}`);
      } else {
        router.push(decodedUrl);
      }
    } else {
      // Redirección por defecto al dashboard con idioma
      console.log('Redirecting to default dashboard:', `/${currentLocale}/dashboard`);
      router.push(`/${currentLocale}/dashboard`);
    }
  };

  return { redirectAfterLogin };
}