import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  const res = NextResponse.next();

  // Inicializamos Supabase desde middleware con ServerClient
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      req,
      res,
    }
  );

  // Obtener sesión
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Rutas permitidas sin login
  const publicRoutes = ["/", "/login", "/register"];

  if (publicRoutes.includes(pathname)) {
    return res;
  }

  // No hay sesión → mandar a login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Obtener rol desde metadata
  const role = session.user?.user_metadata?.role;

  if (!role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Rutas permitidas por rol
  const allow = {
    coordinator: ["/dashboard/coordinator"],
    instructor: ["/dashboard/instructor"],
    parent: ["/dashboard/parent"],
    participant: ["/dashboard/participant"],
  };

  const permitted = allow[role]?.some((p) => pathname.startsWith(p));

  // Si no se permite, redirigir al dashboard según rol
  if (!permitted) {
    return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
  }

  return res;
}

// 🔥 Next.js requiere exportar EXACTAMENTE esto:
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/klan/:path*",
    "/estandar/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
