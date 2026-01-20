import { validarTurnosPorPeriodoQuery } from "../validators/validarTurnosPorPeriodoQuery.js";
import { obtenerTurnosPorPeriodo } from "../services/turnosPorPeriodo.service.js";
import { parsearErrorRPC } from "../../../lib/rpcErrorMapper.js";

export async function getTurnosPorPeriodo(req, res, next) {
  try {
    const actorRol = req.user.rol_normalizado;

    const params = validarTurnosPorPeriodoQuery(req.query, actorRol);

    const data = await obtenerTurnosPorPeriodo(params);

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    if (err?.message || err?.details || err?.hint) {
      return next(parsearErrorRPC(err));
    }
    return next(err);
  }
}
