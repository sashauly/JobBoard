import { Router } from 'express';

import userController from '../controllers/user.controller';

const router = Router();

router.get('/', (req, res) => userController.getAllUsers(req, res));

router.get('/:id', (req, res) => userController.getUserById(req, res));

router.post('/', (req, res) => userController.createUser(req, res));

export default router;
