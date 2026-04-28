const express = require('express');
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validateTask } = require('../middleware/validator');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(validateTask, taskController.createTask);

router
  .route('/:id')
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
