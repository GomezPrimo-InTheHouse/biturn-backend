// src/middlewares/error.middleware.js
import { HttpError } from '../lib/httpErrors.js';

export default function errorMiddleware(err, req, res, next) {
  // Errores de negocio controlados
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      ok: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Errores no controlados
  console.error('Unhandled error:', err);

  return res.status(500).json({
    ok: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
    },
  });
}
