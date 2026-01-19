import { logoutSesion } from '../services/auth.services.js';

export async function logout(req, res, next) {
  try {
    // sessionId viene del access token (sid)
    const sessionId = req.auth?.sid;
    const result = await logoutSesion({ sessionId });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
