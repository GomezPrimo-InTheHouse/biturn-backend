// src/modules/turnos/validators/validarFinalizarTurno.js
import { HttpError } from "../../../lib/httpErrors.js";

export function validarFinalizarTurno(body, actorRol) {
  // Regla: solo empleado/admin
  if (!["empleado", "admin"].includes(actorRol)) {
    throw new HttpError(
      403,
      "Solo empleado o admin pueden finalizar un turno.",
      "FORBIDDEN"
    );
  }

  // Opcional: notas internas
  const notas = body?.notas;

  if (notas !== undefined && notas !== null) {
    if (typeof notas !== "string") {
      throw new HttpError(400, "notas debe ser string", "VALIDATION_ERROR");
    }
    const trimmed = notas.trim();
    if (trimmed.length === 0) {
      throw new HttpError(400, "notas no puede ser vacío", "VALIDATION_ERROR");
    }
    if (trimmed.length > 1000) {
      throw new HttpError(
        400,
        "notas supera el máximo de 1000 caracteres",
        "VALIDATION_ERROR"
      );
    }
    return { notas: trimmed };
  }

  return { notas: null };
}
