import express from 'express';
const router = express.Router();

router.get('/', function (req, res) {
  res.json({ message: 'This is Users' });
});

export default router;
