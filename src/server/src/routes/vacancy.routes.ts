import { Router } from 'express';
import vacancyController from '../controllers/vacancy.controller';

const router = Router();

router.get('/', (req, res) => vacancyController.getAllVacancies(req, res));

router.get('/:id', (req, res) => vacancyController.getVacancyById(req, res));

router.post('/', (req, res) => vacancyController.createVacancy(req, res));

router.put('/:id', (req, res) => vacancyController.updateVacancy(req, res));

router.patch('/:id', (req, res) =>
  vacancyController.changeStatusVacancy(req, res)
);

router.delete('/:id', (req, res) => vacancyController.deleteVacancy(req, res));

export default router;
