import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Obtener el token de autenticación de las cookies
    const authToken = request.cookies.get('auth-token')?.value;

    // Si hay token, intentar hacer logout en el backend
    if (authToken) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        await fetch(`${backendUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });
        // No importa si falla el backend, continuamos limpiando las cookies locales
      } catch (backendError) {
        console.warn('Backend logout failed:', backendError);
        // Continuar con la limpieza local de cookies
      }
    }

    // Limpiar cookies de autenticación localmente
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Eliminar cookies de tokens
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    response.cookies.set('refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Logout API error:', error);

    return NextResponse.json(
      {
        message: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}