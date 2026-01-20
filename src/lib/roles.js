export const normalizarRol = (rol) => {
  if (!rol) return null;

  switch (rol) {
    case "administrador":
    case "admin":
      return "admin";

    case "empleado":
      return "empleado";

    case "cliente":
      return "cliente";

    default:
      return rol; // fallback defensivo
  }
};
