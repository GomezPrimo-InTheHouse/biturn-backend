import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

export async function listarTurnosOperativo({ sucursalId, empleadoId, estado, desde, hasta }) {
  const { data, error } = await supabaseAdmin.rpc("rpc_listar_turnos_operativo", {
    p_sucursal_id: sucursalId,
    p_empleado_id: empleadoId, // null si no filtra
    p_estado: estado, // null si no filtra
    p_desde: desde,
    p_hasta: hasta,
  });

  if (error) throw error;
  return data;
}
