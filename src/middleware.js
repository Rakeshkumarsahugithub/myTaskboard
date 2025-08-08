import { NextResponse } from 'next/server';

export function middleware(request) {
  // Handle CORS preflight requests
  const origin = request.headers.get('origin') || '*';
  
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    // Create a new response with appropriate CORS headers
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400', // 24 hours
        'Vary': 'Origin'
      },
    });
  }
  
  // Handle regular requests
  const response = NextResponse.next();
  
  // Add CORS headers to the response
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Vary', 'Origin');
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};