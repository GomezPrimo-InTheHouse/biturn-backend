export default function roleMiddleware(roles) {
  return (req, res, next) => {
    if (!req.user?.rol) return res.status(401).json({ error: 'No autenticado' });
    if (!roles.includes(req.user.rol)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
