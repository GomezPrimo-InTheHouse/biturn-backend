import { registerClienteService } from '../services/registerCliente.service.js';

export async function registerCliente(req, res, next) {
  try {
    const usuario = await registerClienteService(req.body);
    res.status(201).json({
      message: 'Cliente registrado correctamente',
      user: usuario,
    });
  } catch (err) {
    next(err);
  }
}
