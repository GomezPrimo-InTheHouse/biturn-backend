// src/modules/turnos/controllers/crearTurnoAdmin.controller.js
import { validarCrearTurnoAdmin } from "../validators/validarCrearTurnoAdmin.js";
import { crearTurnoAdmin } from "../services/crearTurnoAdmin.service.js";
import { parsearErrorRPC } from "../../../lib/rpcErrorMapper.js";

export async function postCrearTurnoAdmin(req, res, next) {
  try {
    const actorId = req.user.id;
    const actorRol = req.user.rol_normalizado;

    const { clienteId, sucursalId, empleadoId, servicioIds, inicio, motivo } =
      validarCrearTurnoAdmin(req.body, actorRol);

    const data = await crearTurnoAdmin({
      actorId,
      actorRol,
      clienteId,
      sucursalId,
      empleadoId,
      servicioIds,
      inicio,
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
