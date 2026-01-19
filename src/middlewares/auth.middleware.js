import { verifyAccessToken } from '../config/jwt.js';
import { buscarSesionPorId } from '../modules/auth/repositories/session.respository.js';
import { buscarUsuarioPorId } from '../modules/usuarios/repositories/usuarios.repository.js';

export default async function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Bearer token requerido' });
  }

  const token = h.slice('Bearer '.length).trim();

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    return res.status(401).json({ error: 'Access inválido' });
  }

  try {
    const sesion = await buscarSesionPorId(payload.sid);
    if (!sesion || sesion.estado !== 'activa') {
      return res.status(401).json({ error: 'Sesión inválida' });
    }

    // jti must match (revoca access anterior)
    if (sesion.access_jti !== payload.jti) {
      return res.status(401).json({ error: 'Access revocado' });
    }

    // DB exp defensivo
    if (new Date(sesion.access_expira_en).getTime() < Date.now()) {
      return res.status(401).json({ error: 'Access expirado' });
    }

    const usuario = await buscarUsuarioPorId(payload.sub);
    if (!usuario || usuario.activo === false) {
      return res.status(401).json({ error: 'Usuario inválido' });
    }

    req.user = { id: usuario.id, email: usuario.email, rol: usuario.rol };
    req.auth = { sid: payload.sid, jti: payload.jti };

    return next();
  } catch (err) {
    console.error('authMiddleware error:', err);
    return res.status(500).json({ error: 'Error interno auth' });
  }
}
