import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

export async function listarEventosAgenda({ sucursalId, empleadoId, desde, hasta }) {
  const { data, error } = await supabaseAdmin.rpc("rpc_listar_eventos_agenda", {
    p_sucursal_id: sucursalId,
    p_empleado_id: empleadoId,
    p_desde: desde,
    p_hasta: hasta,
  });

  if (error) throw error;
  return data;
}
