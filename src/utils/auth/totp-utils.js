import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

/**
 * Genera secreto TOTP
 */
export function generarTotp(email) {
  const secret = speakeasy.generateSecret({
    name: `Biturn (${email})`,
    length: 20,
  });

  return {
    base32: secret.base32,
    otpauth_url: secret.otpauth_url,
  };
}

/**
 * QR en consola (opcional, solo debug)
 */
export async function generarQRCodeTerminal(otpauthUrl) {
  return qrcode.toString(otpauthUrl, { type: 'terminal' });
}

/**
 * QR DataURL para frontend
 */
export async function generarQRCodeDataURL(otpauthUrl) {
  return qrcode.toDataURL(otpauthUrl);
}

/**
 * Verificación de código TOTP
 */
export function verificarTotp({ token, secret }) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1, // tolerancia ±30s
  });
}


