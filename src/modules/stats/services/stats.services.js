// src/modules/stats/stats.services.js
import { supabaseAdmin } from "../../lib/supabaseAdmin.js";

export async function obtenerStatsDashboardRPC(payload) {
  const { data, error } = await supabaseAdmin.rpc("rpc_stats_dashboard", payload);
  if (error) throw error;
  return data;
}
