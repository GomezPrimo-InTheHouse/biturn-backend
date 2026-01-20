// src/modules/turnos/services/crearTurnoAdmin.service.js
import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

export async function crearTurnoAdmin({
  actorId,
  actorRol,
  clienteId,
  sucursalId,
  empleadoId,
  servicioIds,
  inicio,
  motivo,
}) {
  const { data, error } = await supabaseAdmin.rpc("rpc_crear_turno_admin", {
    // Ajustá nombres si el SQL usa otros params
    p_actor_id: actorId,
    p_actor_rol: actorRol, // "empleado" | "admin"
    p_cliente_id: clienteId,
    p_sucursal_id: sucursalId,
    p_empleado_id: empleadoId,
    p_servicio_ids: servicioIds, // uuid[]
    p_inicio: inicio, // timestamptz ISO
    p_motivo: motivo, // nullable
  });

  if (error) throw error;
  return data;
}
