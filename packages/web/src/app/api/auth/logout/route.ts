import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Limpiar cookies de autenticación
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Eliminar cookie de token
    response.cookies.set('auth-token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
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