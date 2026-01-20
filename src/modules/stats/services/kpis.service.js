import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

export async function obtenerKpis({ sucursalId, desde, hasta }) {
  const { data, error } = await supabaseAdmin.rpc("rpc_stats_kpis", {
    p_sucursal_id: sucursalId,
    p_desde: desde,
    p_hasta: hasta,
  });

  if (error) throw error;
  return data;
}

