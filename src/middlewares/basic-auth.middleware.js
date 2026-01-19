// src/middlewares/basic-auth.middleware.js
import bcrypt from 'bcrypt';
import { buscarUsuarioPorEmail } from '../modules/usuarios/repositories/usuarios.repository.js';
import { verificarTotp } from '../utils/auth/totp-utils.js';

/**
 * Basic Auth para /auth/login (email:password)
 * - Valida usuario y password
 * - Si el usuario tiene TOTP habilitado => exige y valida req.body.totp
 * - Deja req.user listo para el controller
 */
export async function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Authorization Basic requerida' });
  }

  const base64 = authHeader.slice('Basic '.length).trim();

  let credentials;
  try {
    credentials = Buffer.from(base64, 'base64').toString('utf8');
  } catch {
    return res.status(400).json({ error: 'Basic inválido (base64)' });
  }

  const idx = credentials.indexOf(':');
  if (idx === -1) {
    return res.status(400).json({ error: 'Basic inválido (formato email:password)' });
  }

  const email = credentials.slice(0, idx).trim().toLowerCase();
  const password = credentials.slice(idx + 1);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  try {
    const usuario = await buscarUsuarioPorEmail(email);

    // no filtrar info: mismo mensaje para no dar pistas
    if (!usuario || usuario.activo === false) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const okPass = await bcrypt.compare(password, usuario.password_hash);
    if (!okPass) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // TOTP sólo si está habilitado
    if (usuario.totp_habilitado) {
      const { totp } = req.body || {};
      if (!totp) {
        return res.status(400).json({ error: 'Código TOTP requerido' });
      }

      const okTotp = verificarTotp({ token: String(totp), secret: usuario.totp_seed });
      if (!okTotp) {
        return res.status(401).json({ error: 'TOTP inválido' });
      }
    }

    req.user = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    return next();
  } catch (err) {
    console.error('❌ basicAuth error:', err);
    return res.status(500).json({ error: 'Error interno de autenticación' });
  }
}

export default basicAuth;
