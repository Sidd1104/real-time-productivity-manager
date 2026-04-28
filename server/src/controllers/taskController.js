const Task = require('../models/Task');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const priorityEngine = require('../services/priorityEngine');
const socketService = require('../services/socketService');

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ user: req.user.id });
  
  // Dynamically compute priority and sort
  const prioritizedTasks = priorityEngine.computePriority(tasks);

  res.status(200).json({
    status: 'success',
    results: prioritizedTasks.length,
    data: {
      tasks: prioritizedTasks,
    },
  });
});

exports.createTask = catchAsync(async (req, res, next) => {
  const newTask = await Task.create({
    ...req.body,
    user: req.user.id,
  });

  // Emit real-time update
  socketService.emitTaskUpdate(req.user.id, 'task_created', newTask);

  res.status(201).json({
    status: 'success',
    data: {
      task: newTask,
    },
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  // Emit real-time update
  socketService.emitTaskUpdate(req.user.id, 'task_updated', task);

  res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  // Emit real-time update
  socketService.emitTaskUpdate(req.user.id, 'task_deleted', { id: req.params.id });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
