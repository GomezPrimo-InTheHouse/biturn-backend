// src/modules/turnos/services/cancelarTurno.service.js
import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

export async function cancelarTurno({
  turnoId,
  actorId,
  actorRol,
  tipoCancelacion,
  motivo,
}) {
  const { data, error } = await supabaseAdmin.rpc("rpc_cancelar_turno", {
    p_turno_id: turnoId,
    p_actor_id: actorId,
    p_actor_rol: actorRol, // "cliente" | "empleado" | "admin"
    p_tipo_cancelacion: tipoCancelacion, // "cancelado" | "anulado"
    p_motivo: motivo, // null | string
  });

  if (error) throw error;
  return data;
}
