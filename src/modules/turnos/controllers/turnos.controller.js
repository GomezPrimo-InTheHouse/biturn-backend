import { crearTurnoCliente } from "../services/turnos.service.js";
import { validarCrearTurnoCliente } from "../validators/turnos.validators.js";
import { obtenerDisponibilidad } from "../services/turnos.service.js";
import { validarDisponibilidadQuery } from "../validators/turnos.validators.js";

import { obtenerMisTurnos } from "../services/turnos.service.js";
import { validarRangoFechasQuery } from "../validators/turnos.validators.js";

import { reprogramarTurno } from "../services/turnos.service.js";
import { validarReprogramarTurno } from "../validators/turnos.validators.js";
/**
 * POST /turnos
 * Crea un turno para el cliente autenticado.
 * - Confirmación automática.
 * - Bloquea si las últimas 2 solicitudes del cliente fueron canceladas consecutivamente (por el cliente).
 */
export const postCrearTurnoCliente = async (req, res, next) => {
  try {
    const { sucursalId, empleadoId, servicioIds, inicio } = validarCrearTurnoCliente(req.body);

    const clienteId = req.user.id;

    const data = await crearTurnoCliente({
      clienteId,
      sucursalId,
      empleadoId,
      servicioIds,
      inicio,
    });

    return res.status(201).json({ ok: true, data });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /turnos/disponibilidad
 * Devuelve horarios disponibles para reservar en un rango, considerando:
 * - duración por servicios (slots de 30 min)
 * - solo inicios donde existan N slots consecutivos disponibles
 */
export const getDisponibilidad = async (req, res, next) => {
  try {
    const query = validarDisponibilidadQuery(req.query);

    const data = await obtenerDisponibilidad(query);

    return res.json({ ok: true, data });
  } catch (err) {
    return next(err);
  }
};



/**
 * GET /turnos/mis-turnos
 * Devuelve los turnos del cliente autenticado (fecha y horario) dentro de un rango.
 */
export const getMisTurnos = async (req, res, next) => {
  try {
    const { desde, hasta } = validarRangoFechasQuery(req.query);

    const clienteId = req.user.id;

    const data = await obtenerMisTurnos({ clienteId, desde, hasta });

    return res.json({ ok: true, data });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /turnos/:id/reprogramar
 * Reprograma un turno existente manteniendo el mismo ID.
 * El actor (cliente/empleado/admin) debe pasar un nuevo inicio elegido explícitamente.
 */
export const postReprogramarTurno = async (req, res, next) => {
  try {
    const turnoId = req.params.id;
    const { nuevoInicio } = validarReprogramarTurno(req.body);

    const actorId = req.user.id;
    const actorRol = req.user.rol_normalizado; // cliente|empleado|admin

    const data = await reprogramarTurno({
      turnoId,
      actorId,
      actorRol,
      nuevoInicio,
    });

    return res.json({ ok: true, data });
  } catch (err) {
    return next(err);
  }
};