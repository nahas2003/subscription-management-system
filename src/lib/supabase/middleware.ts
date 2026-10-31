import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase environment variables are missing or unconfigured placeholders, bypass to allow local prototyping
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id') || supabaseUrl.includes('placeholder')) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
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
      return supabaseResponse;
    }

    return supabaseResponse;
  } catch (err) {
    console.warn('[Supabase Middleware] Session check bypassed:', err);
    return supabaseResponse;
  }
}
