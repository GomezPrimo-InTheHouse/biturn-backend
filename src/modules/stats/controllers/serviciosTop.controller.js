import { validarServiciosTopQuery } from "../validators/validarServiciosTopQuery.js";
import { obtenerServiciosTop } from "../services/serviciosTop.service.js";
import { parsearErrorRPC } from "../../../lib/rpcErrorMapper.js";

export async function getServiciosTop(req, res, next) {
  try {
    const actorRol = req.user.rol_normalizado;

    const params = validarServiciosTopQuery(req.query, actorRol);

    const data = await obtenerServiciosTop(params);

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    if (err?.message || err?.details || err?.hint) return next(parsearErrorRPC(err));
    return next(err);
  }
}
