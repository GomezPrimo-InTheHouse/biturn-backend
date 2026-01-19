import { loginConSesion } from '../services/auth.services.js';

export async function login(req, res, next) {
  try {
    // req.user viene de basic-auth.middleware.js
    const reqMeta = {
      ip: req.ip,
      user_agent: req.headers['user-agent'] || null,
      device_id: req.headers['x-device-id'] || null,
    };

    const result = await loginConSesion({ user: req.user, reqMeta });

    res.status(200).json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      sessionId: result.sessionId,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
}
