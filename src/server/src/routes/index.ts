import { Router } from 'express';
const router = Router();

router.get('/', function (req, res) {
  res.json({ message: 'Hello, Express TypeScript!' });
});

export default router;
