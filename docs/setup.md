1. Requisitos Previos

Node.js: Versión 18 o superior.

pnpm: El gestor de paquetes preferido para este proyecto.

Cuentas: Acceso a Sanity.io, Convex.dev y Clerk.com.

2. Instalación

Clonar el repositorio: git clone <url-del-repo>

Instalar dependencias: pnpm install

3. Variables de Entorno

Crea un archivo .env.local en la raíz del proyecto y añade las siguientes claves (puedes encontrarlas en los dashboards de cada servicio):
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID="tu_id_aqui"
NEXT_PUBLIC_SANITY_DATASET="production"

# Convex
CONVEX_DEPLOYMENT="tu_deployment_aqui"
NEXT_PUBLIC_CONVEX_URL="tu_url_aqui"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="tu_key_aqui"
CLERK_SECRET_KEY="tu_secret_aqui"

4. Ejecución del Proyecto

Inicia el backend de Convex: npx convex dev

Inicia el servidor de desarrollo de Next.js: pnpm dev

Abre http://localhost:3000 para ver la app.