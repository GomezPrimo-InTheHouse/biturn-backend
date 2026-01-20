// src/modules/turnos/validators/validarNoAsistioTurno.js
import { HttpError } from "../../../lib/httpErrors.js";

export function validarNoAsistioTurno(body, actorRol) {
  if (!["empleado", "admin"].includes(actorRol)) {
    throw new HttpError(
      403,
      "Solo empleado o admin pueden marcar un turno como no asistió.",
      "FORBIDDEN"
    );
  }

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
      throw new HttpError(
        400,
        "motivo supera el máximo de 280 caracteres",
        "VALIDATION_ERROR"
      );
    }
    return { motivo: trimmed };
  }

  return { motivo: null };
}
