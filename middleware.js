import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
    let token = request.cookies.get('admin_token');

    if (!token) {
        if (request.nextUrl.pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/dashboard', '/add-drop-store', '/categories', '/coupons', '/delivery-boys', '/locations', '/product-approval/:path*'],
}