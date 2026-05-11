import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "./lib/supabase-server";

function getCorsOrigin(requestOrigin: string | null): string {
  const allowed = (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!allowed.length) return "*";
  if (requestOrigin && allowed.includes(requestOrigin)) return requestOrigin;
  return allowed[0];
}

const CORS_HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  // Handle CORS for all /api/* routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: { "Access-Control-Allow-Origin": getCorsOrigin(origin), ...CORS_HEADERS },
      });
    }
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", getCorsOrigin(origin));
    return response;
  }

  // Dashboard pages — require admin auth
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email || !isAdminEmail(user.email)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
};
