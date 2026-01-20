import { HttpError } from "../../../lib/httpErrors.js";

function isUUID(v) {
  return typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function isISO(v) {
  return typeof v === "string" && !Number.isNaN(Date.parse(v));
}

export function validarServiciosTopQuery(query, actorRol) {
  if (!["empleado", "admin"].includes(actorRol)) {
    throw new HttpError(403, "Solo empleado o admin pueden ver estadísticas.", "FORBIDDEN");
  }

  const sucursalId = query?.sucursalId;
  const empleadoId = query?.empleadoId ?? null;
  const desde = query?.desde;
  const hasta = query?.hasta;

  const page = Number(query?.page ?? 1);
  const pageSize = Number(query?.pageSize ?? 20);

  if (!isUUID(sucursalId)) throw new HttpError(400, "sucursalId inválido", "VALIDATION_ERROR");
  if (empleadoId !== null && !isUUID(empleadoId)) throw new HttpError(400, "empleadoId inválido", "VALIDATION_ERROR");
  if (!isISO(desde)) throw new HttpError(400, "desde debe ser ISO válido", "VALIDATION_ERROR");
  if (!isISO(hasta)) throw new HttpError(400, "hasta debe ser ISO válido", "VALIDATION_ERROR");

  const d = Date.parse(desde);
  const h = Date.parse(hasta);
  if (h <= d) throw new HttpError(400, "hasta debe ser mayor a desde", "VALIDATION_ERROR");

  const maxDays = 366;
  const diffDays = (h - d) / (1000 * 60 * 60 * 24);
  if (diffDays > maxDays) throw new HttpError(400, `Rango máximo: ${maxDays} días`, "VALIDATION_ERROR");

  if (!Number.isFinite(page) || page < 1) throw new HttpError(400, "page inválido", "VALIDATION_ERROR");
  if (!Number.isFinite(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new HttpError(400, "pageSize inválido (1..100)", "VALIDATION_ERROR");
  }

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  return { sucursalId, empleadoId, desde, hasta, page, pageSize, offset, limit };
}
