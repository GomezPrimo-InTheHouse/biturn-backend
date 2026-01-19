import { supabase } from '../../../config/supabase.js';

/**
 * Busca un usuario por email
 */
export async function buscarUsuarioPorEmail(email) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Busca un usuario por ID
 */
export async function buscarUsuarioPorId(id) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Crea un usuario admin/empleado con TOTP
 */
export async function crearUsuarioAdminEmpleado({
  nombre,
  email,
  password_hash,
  rol,
  totp_seed,
}) {
  const { data, error } = await supabase
    .from('usuarios')
    .insert({
      nombre,
      email,
      password_hash,
      rol,
      totp_seed,
      totp_habilitado: true,
      activo: true,
    })
    .select(
      'id,nombre,email,rol,totp_habilitado,activo,creado_en'
    )
    .single();

  if (error) throw error;
  return data;
}

/**
 * Actualiza último login
 */
export async function actualizarUltimoLogin(usuarioId) {
  const { error } = await supabase
    .from('usuarios')
    .update({ ultimo_login_en: new Date().toISOString() })
    .eq('id', usuarioId);

  if (error) throw error;
}
