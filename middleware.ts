// catches every request to the application
// checks for a valid session

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    
    // specific pages that are public
    // TODO: change to better expression

    if (req.nextUrl.pathname === '/') {
        return res
    }

    if (req.nextUrl.pathname === '/beers') {
        return res
    }

    if (req.nextUrl.pathname === '/admin') {
        return res
    }
    // stop people based on their session

    const supabase = createMiddlewareClient({req, res})
    const { data: { session }} = await supabase.auth.getSession()

    if (!session) {
        return NextResponse.rewrite(new URL('/login', req.url))
    }

    return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
