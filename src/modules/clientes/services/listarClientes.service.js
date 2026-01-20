import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

export async function listarClientes({ sucursalId, q, limit, offset, sortBy, sortDir }) {
  const { data, error } = await supabaseAdmin.rpc("rpc_listar_clientes", {
    p_sucursal_id: sucursalId, // null ok
    p_q: q,                    // "" ok
    p_limit: limit,
    p_offset: offset,
    p_sort_by: sortBy,
    p_sort_dir: sortDir,
  });

  if (error) throw error;
  return data;
}
