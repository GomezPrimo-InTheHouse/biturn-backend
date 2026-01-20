import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

export async function obtenerTurnosPorPeriodo({
  sucursalId,
  empleadoId,
  desde,
  hasta,
  periodo,
  limit,
  offset,
}) {
  const { data, error } = await supabaseAdmin.rpc("rpc_stats_turnos_por_periodo", {
    p_sucursal_id: sucursalId,
    p_empleado_id: empleadoId, // null ok
    p_desde: desde,
    p_hasta: hasta,
    p_periodo: periodo, // dia|semana|mes
    p_limit: limit,
    p_offset: offset,
  });

  if (error) throw error;
  return data;
}
