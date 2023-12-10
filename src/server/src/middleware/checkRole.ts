export default {
  async checkRole(role: string) {
    return (req, res, next) => {
      if (req.user.role !== role) {
        res.status(403).json({ error: 'Insufficient role' });
      } else {
        next();
      }
    };
  },
};
