// src/modules/agenda/controllers/eliminarBloqueo.controller.js
import { validarEliminarBloqueo } from "../validators/validarEliminarBloqueo.js";
import { eliminarBloqueo } from "../services/eliminarBloqueo.service.js";
import { parsearErrorRPC } from "../../../lib/rpcErrorMapper.js";

export async function deleteBloqueo(req, res, next) {
  try {
    const actorId = req.user.id;
    const actorRol = req.user.rol_normalizado;

    const { bloqueoId } = validarEliminarBloqueo(req.params, actorRol);

    const data = await eliminarBloqueo({ actorId, actorRol, bloqueoId });

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    if (err?.message || err?.details || err?.hint) {
      return next(parsearErrorRPC(err));
    }
    return next(err);
  }
}
