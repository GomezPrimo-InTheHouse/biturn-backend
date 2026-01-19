import bcrypt from 'bcrypt';
import { verifyRefreshToken, signAccessToken, signRefreshToken, newJti, accessExpiraEnDate, refreshExpiraEnDate } from '../../../config/jwt.js';
import { buscarUsuarioPorId } from '../../usuarios/repositories/usuarios.repository.js';
import { crearSesion, buscarSesionPorId, actualizarSesionTokens, revocarSesion } from '../repositories/session.respository.js';
import { verificarTotp } from '../../../utils/auth/totp-utils.js';

export async function loginConSesion({ user, reqMeta }) {
  // basicAuth ya validó password y (si aplica) totp
  const sessionIdPlaceholder = null;

  const accessJti = newJti();
  const refreshJti = newJti();

  // Creamos sesion primero para obtener id
  const sesion = await crearSesion({
    usuario_id: user.id,
    estado: 'activa',
    access_jti: accessJti,
    access_expira_en: accessExpiraEnDate(),
    refresh_jti: refreshJti,
    refresh_token_hash: 'PENDING', // se pisa abajo
    refresh_expira_en: refreshExpiraEnDate(),
    ip: reqMeta.ip || null,
    user_agent: reqMeta.user_agent || null,
    device_id: reqMeta.device_id || null,
  });

  const accessToken = signAccessToken({
    userId: user.id,
    rol: user.rol,
    sessionId: sesion.id,
    jti: accessJti,
  });

  const refreshToken = signRefreshToken({
    userId: user.id,
    sessionId: sesion.id,
    jti: refreshJti,
  });

  const refreshHash = await bcrypt.hash(refreshToken, 10);

  await actualizarSesionTokens({
    sesion_id: sesion.id,
    access_jti: accessJti,
    access_expira_en: sesion.access_expira_en,
    refresh_jti: refreshJti,
    refresh_token_hash: refreshHash,
    refresh_expira_en: sesion.refresh_expira_en,
    refresh_rotado_en: null,
  });

  return {
    accessToken,
    refreshToken,
    sessionId: sesion.id,
  };
}

export async function refreshSesion({ refreshToken, totp, reqMeta }) {
  if (!refreshToken) throw { status: 400, message: 'refreshToken requerido' };

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw { status: 401, message: 'Refresh inválido' };
  }

  const sesion = await buscarSesionPorId(payload.sid);

  if (!sesion || sesion.estado !== 'activa') {
    throw { status: 401, message: 'Sesión inválida' };
  }

  // comparar hash del refresh token actual
  const okHash = await bcrypt.compare(refreshToken, sesion.refresh_token_hash);
  if (!okHash) {
    // token reuse / robo: revocar sesión
    await revocarSesion({ sesion_id: sesion.id });
    throw { status: 401, message: 'Refresh inválido (sesión revocada)' };
  }

  // expira check (defensivo; JWT ya valida exp, pero DB manda)
  if (new Date(sesion.refresh_expira_en).getTime() < Date.now()) {
    await revocarSesion({ sesion_id: sesion.id });
    throw { status: 401, message: 'Refresh expirado' };
  }

  // TOTP si el usuario lo tiene habilitado
  const usuario = await buscarUsuarioPorId(sesion.usuario_id);
  if (usuario.totp_habilitado) {
    if (!totp) throw { status: 400, message: 'TOTP requerido' };
    const okTotp = verificarTotp({ token: String(totp), secret: usuario.totp_seed });
    if (!okTotp) throw { status: 401, message: 'TOTP inválido' };
  }

  const accessJti = newJti();
  const refreshJti = newJti();

  const newAccess = signAccessToken({
    userId: usuario.id,
    rol: usuario.rol,
    sessionId: sesion.id,
    jti: accessJti,
  });

  const newRefresh = signRefreshToken({
    userId: usuario.id,
    sessionId: sesion.id,
    jti: refreshJti,
  });

  const refreshHash = await bcrypt.hash(newRefresh, 10);

  await actualizarSesionTokens({
    sesion_id: sesion.id,
    access_jti: accessJti,
    access_expira_en: accessExpiraEnDate(),
    refresh_jti: refreshJti,
    refresh_token_hash: refreshHash,
    refresh_expira_en: refreshExpiraEnDate(),
    refresh_rotado_en: new Date().toISOString(),
  });

  return { accessToken: newAccess, refreshToken: newRefresh };
}

export async function logoutSesion({ sessionId }) {
  if (!sessionId) throw { status: 400, message: 'sessionId requerido' };
  await revocarSesion({ sesion_id: sessionId });
  return { ok: true };
}
