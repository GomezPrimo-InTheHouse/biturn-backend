// src/modules/agenda/validators/validarCrearBloqueo.js
import { HttpError } from "../../../lib/httpErrors.js";

function isUUID(v) {
  return typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function isISODateString(v) {
  return typeof v === "string" && !Number.isNaN(Date.parse(v));
}

export function validarCrearBloqueo(body, actorRol) {
  if (!["empleado", "admin"].includes(actorRol)) {
    throw new HttpError(
      403,
      "Solo empleado o admin pueden crear bloqueos.",
      "FORBIDDEN"
    );
  }

  const sucursalId = body?.sucursalId;
  const empleadoId = body?.empleadoId;
  const inicio = body?.inicio;
  const fin = body?.fin;

  if (!isUUID(sucursalId)) throw new HttpError(400, "sucursalId inválido", "VALIDATION_ERROR");
  if (!isUUID(empleadoId)) throw new HttpError(400, "empleadoId inválido", "VALIDATION_ERROR");
  if (!isISODateString(inicio)) throw new HttpError(400, "inicio debe ser ISO válido", "VALIDATION_ERROR");
  if (!isISODateString(fin)) throw new HttpError(400, "fin debe ser ISO válido", "VALIDATION_ERROR");

  const iniMs = Date.parse(inicio);
  const finMs = Date.parse(fin);

  if (finMs <= iniMs) {
    throw new HttpError(400, "fin debe ser mayor a inicio", "VALIDATION_ERROR");
  }

  // Reglas de slot 30m: exigimos que inicio/fin estén alineados a 30min
  // (si querés permitir minutos y que SQL redondee, decilo ahora; por seguridad lo validamos)
  const iniDate = new Date(iniMs);
  const finDate = new Date(finMs);

  const iniMin = iniDate.getUTCMinutes();
  const finMin = finDate.getUTCMinutes();

  const isAligned30 = (m) => m === 0 || m === 30;
  if (!isAligned30(iniMin) || !isAligned30(finMin)) {
    throw new HttpError(
      400,
      "inicio y fin deben estar alineados a slots de 30 minutos (mm=00 o mm=30)",
      "VALIDATION_ERROR"
    );
  }

  const motivo = body?.motivo;
  if (motivo !== undefined && motivo !== null) {
    if (typeof motivo !== "string") throw new HttpError(400, "motivo debe ser string", "VALIDATION_ERROR");
    const trimmed = motivo.trim();
    if (trimmed.length === 0) throw new HttpError(400, "motivo no puede ser vacío", "VALIDATION_ERROR");
    if (trimmed.length > 280) throw new HttpError(400, "motivo supera 280 caracteres", "VALIDATION_ERROR");
    return { sucursalId, empleadoId, inicio, fin, motivo: trimmed };
  }

  return { sucursalId, empleadoId, inicio, fin, motivo: null };
}
