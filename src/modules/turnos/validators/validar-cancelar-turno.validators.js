// src/modules/turnos/validators/validarCancelarTurno.js
import { HttpError } from "../../../lib/httpErrors.js";

export function validarCancelarTurno(body, actorRol) {
  const tipoCancelacion = body?.tipoCancelacion;
  const motivo = body?.motivo;

  if (!tipoCancelacion || !["cancelado", "anulado"].includes(tipoCancelacion)) {
    throw new HttpError(
      400,
      "tipoCancelacion debe ser 'cancelado' o 'anulado'",
      "VALIDATION_ERROR"
    );
  }

  if (actorRol === "cliente" && tipoCancelacion === "anulado") {
    throw new HttpError(
      403,
      "Un cliente no puede anular turnos. Solo puede cancelar.",
      "FORBIDDEN"
    );
  }

  if (motivo !== undefined) {
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
  }

  return {
    tipoCancelacion,
    motivo: typeof motivo === "string" ? motivo.trim() : null,
  };
}
