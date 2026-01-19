import { hash } from 'bcrypt';
import {
  generarTotp,
  generarQRCodeTerminal,
  generarQRCodeDataURL,
} from '../../../utils/auth/totp-utils.js';

import {
  buscarUsuarioPorEmail,
  crearUsuarioAdminEmpleado,
} from '../../usuarios/repositories/usuarios.repository.js';

const ROLES_PERMITIDOS = ['admin', 'empleado'];

export async function registerAdminEmpleado({ nombre, email, password, rol }) {
  if (!nombre || !email || !password || !rol) {
    throw { status: 400, message: 'Faltan datos obligatorios' };
  }

  if (!ROLES_PERMITIDOS.includes(rol)) {
    throw {
      status: 400,
      message: `Rol inválido. Permitidos: ${ROLES_PERMITIDOS.join(', ')}`,
    };
  }

  const existente = await buscarUsuarioPorEmail(email);
  if (existente) {
    throw { status: 400, message: 'El email ya está registrado' };
  }

  const password_hash = await hash(password, 10);

  const totp = generarTotp(email);
  const totp_seed = totp.base32;
  const otpauth_url = totp.otpauth_url;

  // QR en terminal (opcional)
  console.log(await generarQRCodeTerminal(otpauth_url));

  const qrCodeDataURL = await generarQRCodeDataURL(otpauth_url);

  const usuario = await crearUsuarioAdminEmpleado({
    nombre,
    email,
    password_hash,
    rol,
    totp_seed,
  });

  return {
    usuario,
    qrCodeDataURL,
  };
}
