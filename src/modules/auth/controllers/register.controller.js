import { registerAdminEmpleado } from '../services/register.service.js';

export async function register(req, res, next) {
  try {
    const result = await registerAdminEmpleado(req.body);
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: result.user,
      qrCodeDataURL: result.qrCodeDataURL,
    });
  } catch (err) {
    next(err);
  }
}
