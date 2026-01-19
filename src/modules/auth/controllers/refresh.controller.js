import { refreshSesion } from '../services/auth.services.js';

export async function refresh(req, res, next) {
  try {
    const { refreshToken, totp } = req.body;

    const reqMeta = {
      ip: req.ip,
      user_agent: req.headers['user-agent'] || null,
      device_id: req.headers['x-device-id'] || null,
    };

    const result = await refreshSesion({ refreshToken, totp, reqMeta });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
