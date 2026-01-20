// src/modules/turnos/controllers/noAsistioTurno.controller.js
import { validarNoAsistioTurno } from "../validators/validarNoAsistioTurno.js";
import { marcarNoAsistio } from "../services/marcarNoAsistio.service.js";
import { parsearErrorRPC } from "../../../lib/rpcErrorMapper.js";

export async function postNoAsistioTurno(req, res, next) {
  try {
    const turnoId = req.params.id;
    const actorId = req.user.id;
    const actorRol = req.user.rol_normalizado;

    const { motivo } = validarNoAsistioTurno(req.body, actorRol);

    const data = await marcarNoAsistio({
      turnoId,
      actorId,
      actorRol,
      motivo,
    });

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    if (err?.message || err?.details || err?.hint) {
      return next(parsearErrorRPC(err));
    }
    return next(err);
  }
}
