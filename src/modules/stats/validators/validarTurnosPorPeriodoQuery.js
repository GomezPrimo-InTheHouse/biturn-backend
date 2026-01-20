import { HttpError } from "../../../lib/httpErrors.js";

function isUUID(v) {
  return typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function isISO(v) {
  return typeof v === "string" && !Number.isNaN(Date.parse(v));
}

const PERIODOS = ["dia", "semana", "mes"];

export function validarTurnosPorPeriodoQuery(query, actorRol) {
  if (!["empleado", "admin"].includes(actorRol)) {
    throw new HttpError(403, "Solo empleado o admin pueden ver estadísticas.", "FORBIDDEN");
  }

  const sucursalId = query?.sucursalId;
  const empleadoId = query?.empleadoId ?? null;
  const desde = query?.desde;
  const hasta = query?.hasta;
  const periodo = (query?.periodo ?? "").toString().toLowerCase();

  const page = Number(query?.page ?? 1);
  const pageSize = Number(query?.pageSize ?? 50);

  if (!isUUID(sucursalId)) throw new HttpError(400, "sucursalId inválido", "VALIDATION_ERROR");
  if (empleadoId !== null && !isUUID(empleadoId)) throw new HttpError(400, "empleadoId inválido", "VALIDATION_ERROR");
  if (!isISO(desde)) throw new HttpError(400, "desde debe ser ISO válido", "VALIDATION_ERROR");
  if (!isISO(hasta)) throw new HttpError(400, "hasta debe ser ISO válido", "VALIDATION_ERROR");
  if (!PERIODOS.includes(periodo)) {
    throw new HttpError(400, "periodo debe ser: dia | semana | mes", "VALIDATION_ERROR");
  }

  const d = Date.parse(desde);
  const h = Date.parse(hasta);
  if (h <= d) throw new HttpError(400, "hasta debe ser mayor a desde", "VALIDATION_ERROR");

  // límites: stats podría ser amplio, pero igual cuidamos
  const maxDays = 366;
  const diffDays = (h - d) / (1000 * 60 * 60 * 24);
  if (diffDays > maxDays) {
    throw new HttpError(400, `Rango máximo: ${maxDays} días`, "VALIDATION_ERROR");
  }

  if (!Number.isFinite(page) || page < 1) throw new HttpError(400, "page inválido", "VALIDATION_ERROR");
  if (!Number.isFinite(pageSize) || pageSize < 1 || pageSize > 200) {
    throw new HttpError(400, "pageSize inválido (1..200)", "VALIDATION_ERROR");
  }

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  return { sucursalId, empleadoId, desde, hasta, periodo, page, pageSize, offset, limit };
}
