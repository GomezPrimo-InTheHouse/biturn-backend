import { validarListarEventosAgenda } from "../validators/validarListarEventosAgenda.js";
import { listarEventosAgenda } from "../services/listarEventosAgenda.service.js";
import { parsearErrorRPC } from "../../../lib/rpcErrorMapper.js";

export async function getEventosAgenda(req, res, next) {
  try {
    const actorRol = req.user.rol_normalizado;

    const params = validarListarEventosAgenda(req.query, actorRol);

    const data = await listarEventosAgenda(params);

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    if (err?.message || err?.details || err?.hint) {
      return next(parsearErrorRPC(err));
    }
    return next(err);
  }
}
