export function authChecker(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).send({ error: 'Authentication needed!' })
  }
  next()
}
