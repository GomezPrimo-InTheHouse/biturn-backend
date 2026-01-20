// src/modules/agenda/controllers/crearBloqueo.controller.js
import { validarCrearBloqueo } from "../validators/validarCrearBloqueo.js";
import { crearBloqueo } from "../services/crearBloqueo.service.js";
import { parsearErrorRPC } from "../../../lib/rpcErrorMapper.js";

export async function postCrearBloqueo(req, res, next) {
  try {
    const actorId = req.user.id;
    const actorRol = req.user.rol_normalizado;

    const { sucursalId, empleadoId, inicio, fin, motivo } = validarCrearBloqueo(
      req.body,
      actorRol
    );

    const data = await crearBloqueo({
      actorId,
      actorRol,
      sucursalId,
      empleadoId,
      inicio,
      fin,
      motivo,
    });

    return res.status(201).json({ ok: true, data });
  } catch (err) {
    if (err?.message || err?.details || err?.hint) {
      return next(parsearErrorRPC(err));
    }
    return next(err);
  }
}
