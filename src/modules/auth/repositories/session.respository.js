import { supabase } from '../../../config/supabase.js';

export async function crearSesion({
  usuario_id,
  estado,
  access_jti,
  access_expira_en,
  refresh_jti,
  refresh_token_hash,
  refresh_expira_en,
  ip,
  user_agent,
  device_id,
}) {
  const { data, error } = await supabase
    .from('sesiones')
    .insert({
      usuario_id,
      estado,
      access_jti,
      access_expira_en,
      refresh_jti,
      refresh_token_hash,
      refresh_expira_en,
      ip,
      user_agent,
      device_id,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function buscarSesionPorId(id) {
  const { data, error } = await supabase
    .from('sesiones')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function actualizarSesionTokens({
  sesion_id,
  access_jti,
  access_expira_en,
  refresh_jti,
  refresh_token_hash,
  refresh_expira_en,
  refresh_rotado_en,
}) {
  const { data, error } = await supabase
    .from('sesiones')
    .update({
      access_jti,
      access_expira_en,
      refresh_jti,
      refresh_token_hash,
      refresh_expira_en,
      refresh_rotado_en,
    })
    .eq('id', sesion_id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function revocarSesion({ sesion_id }) {
  const { error } = await supabase
    .from('sesiones')
    .update({ estado: 'revocada' })
    .eq('id', sesion_id);

  if (error) throw error;
}
