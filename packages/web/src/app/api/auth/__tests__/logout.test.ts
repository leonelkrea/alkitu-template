import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../logout/route';

// Mock fetch globally
global.fetch = vi.fn();

describe('/api/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
    
    // Reset environment variables
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
    vi.unstubAllEnvs(); // Ensure a clean slate for each test
  });

  afterEach(() => {
    vi.unstubAllEnvs(); // Clean up stubs after each test
  });

  it('should logout successfully when auth token is present', async () => {
    // Mock successful backend response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Logout successful' }),
    });

    // Create mock request with auth cookie
    const mockRequest = {
      cookies: {
        get: vi.fn((name: string) => {
          if (name === 'auth-token') {
            return { value: 'mock-jwt-token' };
          }
          return undefined;
        }),
      },
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.message).toBe('Logout successful');

    // Check that backend was called
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/auth/logout',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-jwt-token',
        },
      }
    );
  });

  it('should logout successfully even when no auth token is present', async () => {
    // Create mock request without auth cookie
    const mockRequest = {
      cookies: {
        get: vi.fn(() => undefined),
      },
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.message).toBe('Logout successful');

    // Backend should not be called when no token
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should logout successfully even when backend fails', async () => {
    // Mock backend failure
    (global.fetch as any).mockRejectedValue(new Error('Backend unavailable'));

    // Mock console.warn to avoid noise in tests
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Create mock request with auth cookie
    const mockRequest = {
      cookies: {
        get: vi.fn((name: string) => {
          if (name === 'auth-token') {
            return { value: 'mock-jwt-token' };
          }
          return undefined;
        }),
      },
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.message).toBe('Logout successful');

    // Check that backend was attempted
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/auth/logout',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-jwt-token',
        },
      }
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Backend logout failed:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should set cookies to expire immediately', async () => {
    const mockRequest = {
      cookies: {
        get: vi.fn(() => undefined),
      },
    } as unknown as NextRequest;

    const response = await POST(mockRequest);

    // Check response headers for cookie clearing
    const responseHeaders = response.headers;
    const setCookieHeaders = responseHeaders.getSetCookie();

    expect(setCookieHeaders).toHaveLength(2);
    
    // Check auth-token cookie is cleared
    const authTokenCookie = setCookieHeaders.find(cookie => 
      cookie.includes('auth-token=')
    );
    expect(authTokenCookie).toContain('auth-token=;');
    expect(authTokenCookie).toContain('Max-Age=0');
    expect(authTokenCookie).toContain('Path=/');
    expect(authTokenCookie).toContain('HttpOnly');

    // Check refresh-token cookie is cleared
    const refreshTokenCookie = setCookieHeaders.find(cookie => 
      cookie.includes('refresh-token=')
    );
    expect(refreshTokenCookie).toContain('refresh-token=;');
    expect(refreshTokenCookie).toContain('Max-Age=0');
    expect(refreshTokenCookie).toContain('Path=/');
    expect(refreshTokenCookie).toContain('HttpOnly');
  });

  it('should use production cookie settings when NODE_ENV is production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const mockRequest = {
      cookies: {
        get: vi.fn(() => undefined),
      },
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const setCookieHeaders = response.headers.getSetCookie();

    // In production, cookies should have Secure flag
    setCookieHeaders.forEach(cookie => {
      expect(cookie).toContain('Secure');
    });
  });

  it('should handle unexpected errors gracefully', async () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Create a request that will cause an error
    const mockRequest = {
      cookies: {
        get: vi.fn(() => {
          throw new Error('Cookie parsing failed');
        }),
      },
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData.message).toBe('Internal server error');
    expect(responseData.details).toBe('Cookie parsing failed');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Logout API error:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should use fallback URL when NEXT_PUBLIC_API_URL is not set', async () => {
    delete process.env.NEXT_PUBLIC_API_URL;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Logout successful' }),
    });

    const mockRequest = {
      cookies: {
        get: vi.fn((name: string) => {
          if (name === 'auth-token') {
            return { value: 'mock-jwt-token' };
          }
          return undefined;
        }),
      },
    } as unknown as NextRequest;

    await POST(mockRequest);

    // Should use fallback URL
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/auth/logout',
      expect.any(Object)
    );
  });
});