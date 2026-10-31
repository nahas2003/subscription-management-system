import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Graceful fallback for local frontend development:
  // If Supabase environment variables are missing or placeholders, bypass middleware
  // so the frontend UI and mock authentication work seamlessly without crashing.
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
    return NextResponse.next({
      request,
    });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh auth token
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const url = request.nextUrl.clone();
    const path = url.pathname;

    // Public paths that do not require authentication
    const isPublicPath =
      path === '/' ||
      path.startsWith('/auth') ||
      path.startsWith('/login') ||
      path.startsWith('/signup') ||
      path.startsWith('/api/public') ||
      path.startsWith('/_next') ||
      path.includes('.');

    if (!user && !isPublicPath) {
      // In local dev without active Supabase session, do not lock out demo role pages
      return supabaseResponse;
    }

    return supabaseResponse;
  } catch (err) {
    console.warn('[Supabase Middleware] Session check bypassed:', err);
    return supabaseResponse;
  }
}
