'use client';

import { Button } from '@/components/adapters/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/adapters/Card';
import { Typography } from '@/components/adapters/Typography';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from '@/context/TranslationContext';

export default function UnauthorizedPage() {
  const t = useTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md" migrated={true}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t?.('unauthorized.title') || 'Acceso Denegado'}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {t?.('unauthorized.description') ||
              'No tienes permisos para acceder a esta página'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Typography variant="body" className="text-sm text-gray-500 dark:text-gray-400 mb-4" migrated={true}>
              {t?.('unauthorized.message') ||
                'Por favor, contacta con el administrador si crees que esto es un error.'}
            </Typography>
            <div className="flex flex-col gap-2">
              <Button asChild migrated={true}>
                <Link href="/dashboard">
                  {t?.('unauthorized.goToDashboard') || 'Ir al Dashboard'}
                </Link>
              </Button>
              <Button variant="outline" asChild migrated={true}>
                <Link href="/auth/login">
                  {t?.('unauthorized.goToLogin') || 'Iniciar Sesión'}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
