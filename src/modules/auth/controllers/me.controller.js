export async function me(req, res) {
  res.status(200).json({ user: req.user, sessionId: req.auth.sid });
}
