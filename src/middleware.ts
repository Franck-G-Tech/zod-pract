import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Definimos explícitamente qué puede ver cualquier persona
const isPublicRoute = createRouteMatcher([
  '/',                // Landing Page
  '/sign-in(.*)',     // Login
  '/sign-up(.*)',     // Registro
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 2. Si NO hay sesión y la ruta NO es pública (ej. intentan entrar a /dashboard)
  if (!userId && !isPublicRoute(req)) {
    // Lo mandamos a la página pública
    const signInUrl = new URL('/', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // 3. Si SÍ hay sesión e intentan ir a la raíz, los mandamos al dash (opcional, pero recomendado)
  if (userId && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};