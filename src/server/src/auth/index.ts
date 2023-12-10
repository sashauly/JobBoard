async function authenticate(req, res, next) {
  const token = req.headers.authorization;
  const payload = jwt.verify(token, 'your-secret-key'); // Verify JWT token
  req.user = await prisma.user.findUnique({ where: { id: payload.userId } });
  next();
}
