import { normalizarRol } from "../lib/roles.js";

export const normalizarRolMiddleware = (req, _res, next) => {
  if (req.user?.rol) {
    req.user.rol_normalizado = normalizarRol(req.user.rol);
  }
  next();
};
