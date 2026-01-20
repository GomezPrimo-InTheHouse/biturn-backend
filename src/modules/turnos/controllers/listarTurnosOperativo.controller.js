import { validarListarTurnosOperativoQuery } from "../validators/validarListarTurnosOperativoQuery.js";
import { listarTurnosOperativo } from "../services/listarTurnosOperativo.service.js";
import { parsearErrorRPC } from "../../../lib/rpcErrorMapper.js";

export async function getTurnosOperativo(req, res, next) {
  try {
    const actorRol = req.user.rol_normalizado;

    const { sucursalId, empleadoId, estado, desde, hasta } =
      validarListarTurnosOperativoQuery(req.query, actorRol);

    const data = await listarTurnosOperativo({
      sucursalId,
      empleadoId,
      estado,
      desde,
      hasta,
    });

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    if (err?.message || err?.details || err?.hint) {
      return next(parsearErrorRPC(err));
    }
    return next(err);
  }
}
