<!-- docs/architecture.md (El "Cómo")

Aquí explicas cómo se hablan las piezas que ya conectamos:

El Flujo: Describe cómo el Frontend pide el dato a Sanity, lo recibe y se lo pasa a la mutación de Convex para que el backend tome la decisión final de bloquear o permitir la tarea.

Stack: Confirma el uso de Next.js, Convex, Sanity y Clerk como la estructura base que permite que todo funcione en tiempo real. -->

Este documento describe la arquitectura técnica del proyecto y el flujo de datos entre los tres pilares principales del stack.

1. Diagrama de Flujo de Datos

La aplicación utiliza una arquitectura de "Cerebro de Configuración" (Sanity) y "Motor de Ejecución" (Convex).

2. Los 3 Pilares del Stack

A. Sanity CMS (Capa de Configuración)

Función: Actúa como la fuente de verdad para las reglas de negocio y contenido estático.

Datos Clave: Aquí se define el taskLimit y los mensajes de error/éxito que el usuario verá en el frontend.

Consumo: El Frontend consulta estos datos mediante GROQ al cargar la aplicación.

B. Next.js (Capa de Orquestación)

Función: Es el puente que conecta al usuario con los datos.

Responsabilidad:

Obtiene la configuración de Sanity.

Gestiona la autenticación mediante Clerk.

Envía los parámetros de configuración (como el límite de tareas) a las mutaciones de Convex.

C. Convex (Capa de Persistencia y Lógica)

Función: Base de datos en tiempo real y backend serverless.

Lógica de Negocio: Ejecuta las validaciones finales. Por ejemplo, verifica si el número de tareas actuales en la base de datos es menor al taskLimit enviado por el frontend antes de permitir una inserción.

3. Proceso de una Tarea (Ciclo de Vida)

Carga: El usuario entra a la App. Next.js descarga el taskLimit de Sanity (ej. 5).

Acción: El usuario intenta crear una nueva tarea.

Validación: El componente TodoForm envía el título de la tarea y el límite (5) a la mutación de Convex.

Ejecución:

Convex cuenta las tareas existentes del usuario.

Si tareasActuales >= 5, Convex lanza un error LIMIT_REACHED.

Si es menor, guarda la tarea y actualiza la UI en tiempo real.

4. Tecnologías Adicionales

Clerk: Gestión de usuarios y sesiones.

Stripe: Procesamiento de pagos para el plan Pro (que elimina el límite de tareas).

Zod: Validación de esquemas en el cliente para asegurar que los datos tengan el formato correcto antes de salir del navegador.