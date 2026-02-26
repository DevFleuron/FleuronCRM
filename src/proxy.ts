import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si c'est la page de login
  const isLoginPage = pathname === "/login";

  // Vérifier si l'utilisateur a un token
  const token = request.cookies.get("token")?.value;

  // Si pas de token et pas sur /login → rediriger vers /login
  if (!token && !isLoginPage) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si token existe et sur /login → rediriger vers /dashboard
  if (token && isLoginPage) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Sinon, laisser passer
  return NextResponse.next();
}

// Configurer quelles routes doivent passer par le middleware
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - api (API routes)
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
