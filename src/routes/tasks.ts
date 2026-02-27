import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { errorHandler } from '../middleware/errorHandler';

const router = Router();
const taskController = new TaskController();

router.post('/', taskController.create.bind(taskController));
router.get('/', taskController.findAll.bind(taskController));
router.get('/:id', taskController.findById.bind(taskController));
router.put('/:id', taskController.update.bind(taskController));
router.delete('/:id', taskController.delete.bind(taskController));

router.use(errorHandler);

export default router;
