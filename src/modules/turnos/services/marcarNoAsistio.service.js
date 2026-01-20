// src/modules/turnos/services/marcarNoAsistio.service.js
import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

export async function marcarNoAsistio({ turnoId, actorId, actorRol, motivo }) {
  const { data, error } = await supabaseAdmin.rpc("rpc_marcar_no_asistio", {
    // Ajustá si tu RPC usa otros nombres
    p_turno_id: turnoId,
    p_actor_id: actorId,
    p_actor_rol: actorRol, // "empleado" | "admin"
    p_motivo: motivo, // null | string
  });

  if (error) throw error;
  return data;
}
