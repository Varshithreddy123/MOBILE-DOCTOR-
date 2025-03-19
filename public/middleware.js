import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

// Initialize Firebase Admin SDK (Run only once)
if (!global._firebaseAdmin) {
  initializeApp({
    credential: applicationDefault(),
  });
  global._firebaseAdmin = true;
}

// Middleware function to check authentication
export async function middleware(request) {
  const token = request.cookies.get('firebaseAuthToken'); // Correct way to get cookie

  if (!token) {
    // Redirect to login if token is missing
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname); // Preserve original path
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify Firebase token
    await getAuth().verifyIdToken(token);

    // Allow access if authentication is valid
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Auth Error:', error.message);

    // Redirect if token is invalid/expired
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Protect specific routes
export const config = {
  matcher: ['/details/:path*', '/profile/:path*'], // Ensure dynamic paths like `/details/1`
};
