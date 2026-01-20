// src/modules/turnos/services/finalizarTurno.service.js
import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

export async function finalizarTurno({ turnoId, actorId, actorRol, notas }) {
  const { data, error } = await supabaseAdmin.rpc("rpc_finalizar_turno", {
    // Ajustá si tu RPC define otros nombres
    p_turno_id: turnoId,
    p_actor_id: actorId,
    p_actor_rol: actorRol, // "empleado" | "admin"
    p_notas: notas, // null | string (si el SQL lo contempla)
  });

  if (error) throw error;
  return data;
}
