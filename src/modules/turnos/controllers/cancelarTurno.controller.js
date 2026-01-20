// src/modules/turnos/controllers/cancelarTurno.controller.js
import { HttpError } from "../../../lib/httpErrors.js";
import { validarCancelarTurno } from "../validators/validar-cancelar-turno.validators.js";
import { cancelarTurno } from "../services/cancelarTurnos.service.js";
import {mapearErrorRPC } from "../../../lib/rpcErrorMapper.js";
import { parsearErrorRPC } from "../../../lib/rpcErrorParser.js";

export async function postCancelarTurno(req, res, next) {
  try {
    const turnoId = req.params.id;
    const actorId = req.user.id;
    const actorRol = req.user.rol_normalizado;

    const { tipoCancelacion, motivo } = validarCancelarTurno(req.body, actorRol);

    const result = await cancelarTurno({
      turnoId,
      actorId,
      actorRol,
      tipoCancelacion,
      motivo,
    });

    return res.status(200).json({ ok: true, data: result });
  } catch (err) {
    // Errores RPC estandarizados
    if (err?.message || err?.details) {
      const parsed = parsearErrorRPC(err);
      const mapped = mapearErrorRPC(parsed.code);

      return next(new HttpError(mapped.status, parsed.message, mapped.code));
    }

    return next(err);
  }
}
