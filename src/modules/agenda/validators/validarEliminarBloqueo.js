// src/modules/agenda/validators/validarEliminarBloqueo.js
import { HttpError } from "../../../lib/httpErrors.js";

function isUUID(v) {
  return typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export function validarEliminarBloqueo(params, actorRol) {
  if (!["empleado", "admin"].includes(actorRol)) {
    throw new HttpError(
      403,
      "Solo empleado o admin pueden eliminar bloqueos.",
      "FORBIDDEN"
    );
  }

  const bloqueoId = params?.id;
  if (!isUUID(bloqueoId)) {
    throw new HttpError(400, "id de bloqueo inválido", "VALIDATION_ERROR");
  }

  return { bloqueoId };
}
