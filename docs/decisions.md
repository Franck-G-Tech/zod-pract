<!-- docs/decisions.md (El "Por qué")

Este documento registra el razonamiento detrás de lo que programamos juntos:

Lógica Dinámica: Registra la decisión de no dejar el límite de tareas fijo en el código (hardcoded), sino traerlo desde Sanity para que sea editable sin programar.

Flujo de Trabajo: Establece que ahora el equipo usará GitFlow y Pull Requests, tal como investigaste, para asegurar que nadie rompa la lógica de límites por accidente. -->


ADR 1: Adopción de GitFlow y Pull Requests

Fecha: 2026-02-12

Estatus: Decidido

Contexto: El equipo necesita un entorno de colaboración que garantice la estabilidad del código y permita la revisión entre pares.

Decisión: Se implementa GitFlow con una rama develop como base de integración y ramas feature/* para tareas individuales. No se permite el push directo a main ni a develop.

Consecuencias: * Todo cambio debe pasar por un Pull Request (PR).

Se requiere al menos una aprobación de un compañero antes del merge.

Mejora la calidad del código mediante el Code Review.

ADR 2: Gestión de Límites Dinámicos (Sanity + Convex)

Fecha: 2026-02-12

Estatus: Decidido

Contexto: Se requiere limitar la creación de tareas para usuarios gratuitos sin necesidad de redeplegar el código cada vez que el límite cambie.

Decisión: El valor de taskLimit se define en Sanity CMS y se envía desde el Frontend hacia la mutación de Convex.

Alternativas consideradas: Hardcodear el límite en el backend (descartado por falta de flexibilidad).

Consecuencias: * El equipo de producto puede ajustar límites desde el dashboard de Sanity.

El backend valida el límite en tiempo real contra el conteo de documentos en Convex.

ADR 3: Estándar de Mensajes de Commit

Fecha: 2026-02-12

Estatus: Decidido

Contexto: El historial de Git era difícil de leer y carecía de estructura.

Decisión: Se adopta el estándar de Conventional Commits (feat:, fix:, docs:, refactor:).

Consecuencias: * Historial de cambios legible y profesional.

Es obligatorio incluir el número de Issue relacionado (ej: #1) en el mensaje para mantener la trazabilidad.