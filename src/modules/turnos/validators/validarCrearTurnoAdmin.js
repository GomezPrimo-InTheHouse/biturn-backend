// src/modules/turnos/validators/validarCrearTurnoAdmin.js
import { HttpError } from "../../../lib/httpErrors.js";

function isUUID(v) {
  return typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function isISODateString(v) {
  return typeof v === "string" && !Number.isNaN(Date.parse(v));
}

function parseServicioIds(input) {
  // soporta array ["uuid", ...] o string "uuid,uuid"
  if (Array.isArray(input)) return input;
  if (typeof input === "string") {
    return input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return null;
}

export function validarCrearTurnoAdmin(body, actorRol) {
  if (!["empleado", "admin"].includes(actorRol)) {
    throw new HttpError(
      403,
      "Solo empleado o admin pueden crear turnos manuales.",
      "FORBIDDEN"
    );
  }

  const clienteId = body?.clienteId;
  const sucursalId = body?.sucursalId;
  const empleadoId = body?.empleadoId;
  const inicio = body?.inicio;
  const servicioIds = parseServicioIds(body?.servicioIds);

  if (!isUUID(clienteId)) {
    throw new HttpError(400, "clienteId inválido", "VALIDATION_ERROR");
  }
  if (!isUUID(sucursalId)) {
    throw new HttpError(400, "sucursalId inválido", "VALIDATION_ERROR");
  }
  if (!isUUID(empleadoId)) {
    throw new HttpError(400, "empleadoId inválido", "VALIDATION_ERROR");
  }
  if (!isISODateString(inicio)) {
    throw new HttpError(400, "inicio debe ser fecha ISO válida", "VALIDATION_ERROR");
  }
  if (!servicioIds || servicioIds.length === 0) {
    throw new HttpError(
      400,
      "servicioIds es requerido (array o string coma-separado)",
      "VALIDATION_ERROR"
    );
  }
  for (const id of servicioIds) {
    if (!isUUID(id)) {
      throw new HttpError(400, "servicioIds contiene UUID inválido", "VALIDATION_ERROR");
    }
  }

  // Opcional: motivo/nota interna de por qué se está haciendo manual
  const motivo = body?.motivo;
  if (motivo !== undefined && motivo !== null) {
    if (typeof motivo !== "string") {
      throw new HttpError(400, "motivo debe ser string", "VALIDATION_ERROR");
    }
    const trimmed = motivo.trim();
    if (trimmed.length === 0) {
      throw new HttpError(400, "motivo no puede ser vacío", "VALIDATION_ERROR");
    }
    if (trimmed.length > 280) {
      throw new HttpError(400, "motivo supera 280 caracteres", "VALIDATION_ERROR");
    }
    return {
      clienteId,
      sucursalId,
      empleadoId,
      inicio,
      servicioIds,
      motivo: trimmed,
    };
  }

  return { clienteId, sucursalId, empleadoId, inicio, servicioIds, motivo: null };
}
