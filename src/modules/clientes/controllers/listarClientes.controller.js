import { validarListarClientesQuery } from "../validators/validarListarClientesQuery.js";
import { listarClientes } from "../services/listarClientes.service.js";
import { parsearErrorRPC } from "../../../lib/rpcErrorMapper.js";

export async function getClientes(req, res, next) {
  try {
    const actorRol = req.user.rol_normalizado;

    const params = validarListarClientesQuery(req.query, actorRol);

    const data = await listarClientes(params);

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    if (err?.message || err?.details || err?.hint) return next(parsearErrorRPC(err));
    return next(err);
  }
}
