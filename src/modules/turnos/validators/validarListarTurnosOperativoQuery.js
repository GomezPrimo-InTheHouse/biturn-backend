import { HttpError } from "../../../lib/httpErrors.js";

function isUUID(v) {
  return typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function isISODateString(v) {
  return typeof v === "string" && !Number.isNaN(Date.parse(v));
}

const ESTADOS_VALIDOS = [
  "confirmado",
  "cancelado",
  "finalizado",
  "no_asistio",
  "anulado",
  "pendiente",
];

export function validarListarTurnosOperativoQuery(query, actorRol) {
  if (!["empleado", "admin"].includes(actorRol)) {
    throw new HttpError(
      403,
      "Solo empleado o admin pueden listar turnos del local.",
      "FORBIDDEN"
    );
  }

  const sucursalId = query?.sucursalId;
  const empleadoId = query?.empleadoId ?? null;
  const estado = query?.estado ?? null;
  const desde = query?.desde;
  const hasta = query?.hasta;

  if (!isUUID(sucursalId)) throw new HttpError(400, "sucursalId inválido", "VALIDATION_ERROR");
  if (empleadoId !== null && !isUUID(empleadoId)) throw new HttpError(400, "empleadoId inválido", "VALIDATION_ERROR");
  if (!isISODateString(desde)) throw new HttpError(400, "desde debe ser ISO válido", "VALIDATION_ERROR");
  if (!isISODateString(hasta)) throw new HttpError(400, "hasta debe ser ISO válido", "VALIDATION_ERROR");

  const desdeMs = Date.parse(desde);
  const hastaMs = Date.parse(hasta);

  if (hastaMs <= desdeMs) {
    throw new HttpError(400, "hasta debe ser mayor a desde", "VALIDATION_ERROR");
  }

  // límite de rango para evitar queries enormes
  const maxDays = 60;
  const diffDays = (hastaMs - desdeMs) / (1000 * 60 * 60 * 24);
  if (diffDays > maxDays) {
    throw new HttpError(
      400,
      `El rango máximo permitido es ${maxDays} días`,
      "VALIDATION_ERROR"
    );
  }

  if (estado !== null) {
    if (typeof estado !== "string") {
      throw new HttpError(400, "estado inválido", "VALIDATION_ERROR");
    }
    if (!ESTADOS_VALIDOS.includes(estado)) {
      throw new HttpError(
        400,
        `estado debe ser uno de: ${ESTADOS_VALIDOS.join(", ")}`,
        "VALIDATION_ERROR"
      );
    }
  }

  return { sucursalId, empleadoId, estado, desde, hasta };
}
