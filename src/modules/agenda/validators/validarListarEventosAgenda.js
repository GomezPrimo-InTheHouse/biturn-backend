import { HttpError } from "../../../lib/httpErrors.js";

function isUUID(v) {
  return typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function isISO(v) {
  return typeof v === "string" && !Number.isNaN(Date.parse(v));
}

export function validarListarEventosAgenda(query, actorRol) {
  if (!["empleado", "admin"].includes(actorRol)) {
    throw new HttpError(403, "Acceso denegado", "FORBIDDEN");
  }

  const { sucursalId, empleadoId = null, desde, hasta } = query;

  if (!isUUID(sucursalId)) throw new HttpError(400, "sucursalId inválido");
  if (empleadoId && !isUUID(empleadoId)) throw new HttpError(400, "empleadoId inválido");
  if (!isISO(desde) || !isISO(hasta)) throw new HttpError(400, "Fechas inválidas");

  const d = Date.parse(desde);
  const h = Date.parse(hasta);
  if (h <= d) throw new HttpError(400, "hasta debe ser mayor a desde");

  return { sucursalId, empleadoId, desde, hasta };
}
