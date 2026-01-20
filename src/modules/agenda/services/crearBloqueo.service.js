// src/modules/agenda/services/crearBloqueo.service.js
import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

export async function crearBloqueo({
  actorId,
  actorRol,
  sucursalId,
  empleadoId,
  inicio,
  fin,
  motivo,
}) {
  const { data, error } = await supabaseAdmin.rpc("rpc_crear_bloqueo", {
    p_actor_id: actorId,
    p_actor_rol: actorRol, // empleado|admin
    p_sucursal_id: sucursalId,
    p_empleado_id: empleadoId,
    p_inicio: inicio,
    p_fin: fin,
    p_motivo: motivo,
  });

  if (error) throw error;
  return data;
}
