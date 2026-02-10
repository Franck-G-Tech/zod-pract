export const siteConfigType = {
  name: "siteConfig",
  title: "Configuración del sitio",
  type: "document",
  fields: [
    {
        name:"taskLimit",
        title: "Límite de tareas diarias",
        type: "number",
        description: "Número máximo de tareas que un usuario puede marcar como completadas en un día sin necesidad de actualizar a Pro."
    },
    {
      name: "succesMessage",
      title: "Mensaje de limite alcanzado",
      type: "string",
      description:
        "Mensaje que se muestra cuando el usuario alcanza el límite de tareas completadas en un día.",
    },
    {
      name: "successMessage",
      title: "Mensaje de éxito (tarea Creada)",
      type: "string",
    },
    {
      name: "freePlanText",
      title: "Texto del Plan Gratuito",
      type: "text",
      description: "Descripción de lo que incluye el plan gratis.",
    },
    {
      name: "premiumPlanText",
      title: "Texto del Plan Pro",
      type: "text",
    },
  ],
};
