import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ENV } from './env.js';

const ACCESS_TTL_SEC = Number(process.env.JWT_ACCESS_TTL || 900);      // 15 min
const REFRESH_TTL_SEC = Number(process.env.JWT_REFRESH_TTL || 2592000); // 30 días

export function newJti() {
  return uuidv4();
}

export function signAccessToken({ userId, rol, sessionId, jti }) {
  return jwt.sign(
    { sub: userId, rol, sid: sessionId, jti },
    ENV.JWT_SECRET,
    { expiresIn: ACCESS_TTL_SEC }
  );
}

export function signRefreshToken({ userId, sessionId, jti }) {
  return jwt.sign(
    { sub: userId, sid: sessionId, jti, typ: 'refresh' },
    ENV.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TTL_SEC }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ENV.JWT_SECRET);
}

export function verifyRefreshToken(token) {
  const payload = jwt.verify(token, ENV.JWT_REFRESH_SECRET);
  if (payload.typ !== 'refresh') throw new Error('Invalid refresh token type');
  return payload;
}

export function accessExpiraEnDate() {
  return new Date(Date.now() + ACCESS_TTL_SEC * 1000).toISOString();
}

export function refreshExpiraEnDate() {
  return new Date(Date.now() + REFRESH_TTL_SEC * 1000).toISOString();
}
