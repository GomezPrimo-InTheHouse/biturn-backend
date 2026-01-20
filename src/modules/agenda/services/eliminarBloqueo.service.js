// src/modules/agenda/services/eliminarBloqueo.service.js
import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

export async function eliminarBloqueo({ actorId, actorRol, bloqueoId }) {
  const { data, error } = await supabaseAdmin.rpc("rpc_eliminar_bloqueo", {
    p_actor_id: actorId,
    p_actor_rol: actorRol,
    p_bloqueo_id: bloqueoId,
  });

  if (error) throw error;
  return data;
}
