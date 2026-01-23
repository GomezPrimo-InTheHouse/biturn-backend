import { hash } from 'bcrypt';
import { buscarUsuarioPorEmail, crearUsuarioCliente } from '../../usuarios/repositories/usuarios.repository.js';

export async function registerClienteService({ nombre, email, password }) {
  if (!nombre || !email || !password) {
    throw { status: 400, message: 'Faltan datos obligatorios' };
  }

  const existente = await buscarUsuarioPorEmail(email);
  if (existente) {
    throw { status: 400, message: 'El email ya está registrado' };
  }

  const password_hash = await hash(password, 10);

  const usuario = await crearUsuarioCliente({
    nombre,
    email,
    password_hash,
  });

  return usuario;
}
