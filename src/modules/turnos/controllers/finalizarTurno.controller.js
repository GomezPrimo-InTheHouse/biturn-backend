// src/modules/turnos/controllers/finalizarTurno.controller.js
import { validarFinalizarTurno } from "../validators/validarFinalizarTurno.js";
import { finalizarTurno } from "../services/finalizarTurno.service.js";
import { parsearErrorRPC } from "../../../lib/rpcErrorParser.js";

export async function postFinalizarTurno(req, res, next) {
  try {
    const turnoId = req.params.id;

    const actorId = req.user.id;
    const actorRol = req.user.rol_normalizado;

    const { notas } = validarFinalizarTurno(req.body, actorRol);

    const data = await finalizarTurno({
      turnoId,
      actorId,
      actorRol,
      notas,
    });

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    if (err?.message || err?.details || err?.hint) {
      return next(parsearErrorRPC(err));
    }
    return next(err);
  }
}
