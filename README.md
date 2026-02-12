🚀 Task Manager Pro
Este proyecto es una aplicación de gestión de tareas diseñada para demostrar un flujo de trabajo profesional, integrando configuraciones dinámicas desde un CMS y validaciones en tiempo real en el backend.

🛠️ Stack Tecnológico
El proyecto utiliza las tecnologías más modernas para garantizar velocidad y escalabilidad:

Frontend: Next.js (App Router) con TypeScript.

Backend & DB: Convex para persistencia de datos en tiempo real.

CMS: Sanity.io para la gestión de reglas de negocio y límites de usuario.

Autenticación: Clerk para el manejo de sesiones de usuario.

Estilos: Tailwind CSS y Lucide React para iconografía.

🏗️ Arquitectura General
La aplicación sigue un flujo de datos desacoplado:

Sanity provee la configuración (ej. límite de tareas).

Next.js orquestra la UI y envía los parámetros a las mutaciones.

Convex valida la lógica de negocio antes de guardar los datos.

📘 Para más detalles, consulta nuestra Documentación de Arquitectura.

💻 Cómo correrlo local
Para levantar el proyecto en tu máquina local, sigue estos pasos simplificados:

Clona el repo: git clone <tu-repo-url>

Instala dependencias: pnpm install

Configura variables: Copia el archivo .env.example a .env.local con tus llaves.

Backend: Ejecuta npx convex dev en una terminal.

Frontend: Ejecuta pnpm dev en otra terminal.

⚙️ Instrucciones detalladas de variables de entorno en: Guía de Setup.

🤝 Colaboración y Decisiones
Mantenemos un registro estricto de nuestras decisiones técnicas (ADRs) para asegurar la trazabilidad del proyecto.

Registro de Decisiones (ADRs)

Flujo de trabajo: GitFlow (Ramas feature/ -> develop -> main).

🚀 ¿Cuál es el siguiente paso?

Como este cambio también es documentación, podrías agregarlo a la misma rama en la que estás (feature/setup-tech-docs) antes de cerrar el Pull Request.

¿Te gustaría que te ayude a redactar el comando para actualizar tu commit actual con este nuevo archivo README.md?