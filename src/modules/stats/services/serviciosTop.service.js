import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

export async function obtenerServiciosTop({ sucursalId, empleadoId, desde, hasta, limit, offset }) {
  const { data, error } = await supabaseAdmin.rpc("rpc_stats_servicios_top", {
    p_sucursal_id: sucursalId,
    p_empleado_id: empleadoId, // null ok
    p_desde: desde,
    p_hasta: hasta,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) throw error;
  return data;
}
