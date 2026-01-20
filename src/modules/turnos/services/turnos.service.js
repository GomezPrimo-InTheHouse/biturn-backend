import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";
import { HttpError } from "../../../lib/httpErrors.js";

const parsearCodigoRPC = (msg = "") => {
  // Formato esperado: "CODIGO:ALGO|Mensaje humano"
  const m = String(msg).match(/CODIGO:([A-Z0-9_]+)\|(.+)$/);
  if (!m) return null;
  return { code: m[1], message: m[2] };
};


const mapearErrorRPC = (error) => {
  const raw = error?.message || "Error en operación";
  const parsed = parsearCodigoRPC(raw);

  const code = parsed?.code || "RPC_ERROR";
  const message = parsed?.message?.trim() || raw;

  // Mapeo de errores esperados del core
  if (code === "TURNO_NO_ENCONTRADO") return new HttpError(404, message || "Turno no encontrado", code);
  if (code === "TURNO_NO_REPROGRAMABLE") return new HttpError(409, message || "Turno no reprogramable", code);
  if (code === "REGLA_2_HORAS") return new HttpError(409, message || "No podés reprogramar con menos de 2 horas", code);
  if (code === "SLOTS_NO_DISPONIBLES") return new HttpError(409, message || "Horario no disponible", code);
  if (code === "DURACION_INVALIDA") return new HttpError(400, message || "Duración inválida", code);

  // Fallback
  return new HttpError(400, message, code);
};

/**
 * Crea un turno (cliente) llamando a la RPC atómica.
 */
export const crearTurnoCliente = async ({ clienteId, sucursalId, empleadoId, servicioIds, inicio }) => {
  const { data, error } = await supabaseAdmin.rpc("rpc_crear_turno_cliente", {
    cliente_id: clienteId,
    sucursal_id: sucursalId,
    empleado_id: empleadoId,
    servicio_ids: servicioIds,
    inicio,
  });

  if (error) throw mapearErrorRPC(error);
  return data;
};

/**
 * Reprograma un turno (MOVE atómico) manteniendo el mismo turno_id.
 * - Libera slots actuales
 * - Reserva N slots consecutivos desde p_nuevo_inicio
 * - Actualiza inicio/fin del turno
 */
export const reprogramarTurno = async ({ turnoId, actorId, actorRol, nuevoInicio }) => {
  const { data, error } = await supabaseAdmin.rpc("rpc_reprogramar_turno", {
    p_turno_id: turnoId,
    p_actor_id: actorId,
    p_actor_rol: actorRol, // cliente|empleado|admin (ya normalizado)
    p_nuevo_inicio: nuevoInicio,
  });

  if (error) throw mapearErrorRPC(error);
  return data;
};




/**
 * Obtiene disponibilidad llamando a la RPC.
 */
export const obtenerDisponibilidad = async ({ sucursalId, empleadoId, servicioIds, desde, hasta }) => {
  const { data, error } = await supabaseAdmin.rpc("rpc_obtener_disponibilidad", {
    sucursal_id: sucursalId,
    empleado_id: empleadoId,
    servicio_ids: servicioIds,
    desde,
    hasta,
  });

  if (error) throw mapearErrorRPC(error);
  return data;
};

/**
 * Obtiene los turnos del cliente autenticado dentro de un rango.
 * Devuelve fecha/hora de inicio y fin, estado y referencias (sucursal/empleado).
 */
export const obtenerMisTurnos = async ({ clienteId, desde, hasta }) => {
  const { data, error } = await supabaseAdmin.rpc("rpc_obtener_turnos_cliente", {
    cliente_id: clienteId,
    desde,
    hasta,
  });

  if (error) throw mapearErrorRPC(error);
  return data;
};

