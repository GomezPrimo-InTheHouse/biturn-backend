import { HttpError } from "../../../lib/httpErrors.js";

const isISODateTime = (v) => typeof v === "string" && !Number.isNaN(Date.parse(v));

export const validarCrearTurnoCliente = (body) => {
  const { sucursalId, empleadoId, servicioIds, inicio } = body || {};

  if (!sucursalId) throw new HttpError(400, "sucursalId es requerido", "VALIDACION");
  if (!empleadoId) throw new HttpError(400, "empleadoId es requerido", "VALIDACION");
  if (!Array.isArray(servicioIds) || servicioIds.length === 0) {
    throw new HttpError(400, "servicioIds debe ser un array no vacío", "VALIDACION");
  }
  if (!isISODateTime(inicio)) throw new HttpError(400, "inicio debe ser un ISO datetime", "VALIDACION");

  return { sucursalId, empleadoId, servicioIds, inicio };
};

export const validarDisponibilidadQuery = (q) => {
  const { sucursalId, empleadoId, servicioIds, desde, hasta } = q || {};

  if (!sucursalId) throw new HttpError(400, "sucursalId es requerido", "VALIDACION");
  if (!servicioIds) throw new HttpError(400, "servicioIds es requerido (coma-separado)", "VALIDACION");
  if (!desde || !isISODateTime(desde)) throw new HttpError(400, "desde debe ser ISO datetime", "VALIDACION");
  if (!hasta || !isISODateTime(hasta)) throw new HttpError(400, "hasta debe ser ISO datetime", "VALIDACION");

  const servicio_ids = String(servicioIds)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (servicio_ids.length === 0) {
    throw new HttpError(400, "servicioIds debe contener al menos 1 id", "VALIDACION");
  }

  return {
    sucursalId,
    empleadoId: empleadoId || null,
    servicioIds: servicio_ids,
    desde,
    hasta,
  };
};

/**
 * Valida query { desde, hasta } en ISO datetime.
 */
export const validarRangoFechasQuery = (q) => {
  const { desde, hasta } = q || {};

  if (!desde || !isISODateTime(desde)) {
    throw new HttpError(400, "desde debe ser ISO datetime", "VALIDACION");
  }
  if (!hasta || !isISODateTime(hasta)) {
    throw new HttpError(400, "hasta debe ser ISO datetime", "VALIDACION");
  }

  if (new Date(desde).getTime() >= new Date(hasta).getTime()) {
    throw new HttpError(400, "desde debe ser menor que hasta", "VALIDACION");
  }

  return { desde, hasta };
};


export const validarReprogramarTurno = (body) => {
  const { nuevoInicio } = body || {};
  if (!isISODateTime(nuevoInicio)) {
    throw new HttpError(400, "nuevoInicio debe ser un ISO datetime", "VALIDACION");
  }
  return { nuevoInicio };
};