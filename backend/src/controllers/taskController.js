const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');

const canAccessTask = (task, user) => user.role === 'admin' || task.userId.toString() === user._id.toString();

const buildTaskQuery = (user) => (user.role === 'admin' ? {} : { userId: user._id });

const getTasks = async (req, res) => {
  const tasks = await Task.find(buildTaskQuery(req.user))
    .populate('userId', 'name email role')
    .sort({ createdAt: -1 });

  res.json({ tasks });
};

const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id).populate('userId', 'name email role');

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (!canAccessTask(task, req.user)) {
    return res.status(403).json({ message: 'Not authorized to access this task' });
  }

  res.json({ task });
};

const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, userId } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const normalizedTitle = String(title).trim();
  const normalizedDescription = String(description).trim();

  if (normalizedTitle.length < 3) {
    return res.status(400).json({ message: 'Task title must be at least 3 characters long' });
  }

  if (normalizedDescription.length < 10) {
    return res.status(400).json({ message: 'Task description must be at least 10 characters long' });
  }

  const normalizedDueDate = dueDate ? new Date(dueDate) : undefined;

  if (dueDate && Number.isNaN(normalizedDueDate?.getTime())) {
    return res.status(400).json({ message: 'Due date is invalid' });
  }

  let assignedUserId = req.user._id;

  if (req.user.role === 'admin' && userId) {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Selected assignee is invalid' });
    }

    const assigneeExists = await User.findById(userId).select('_id');
    if (!assigneeExists) {
      return res.status(400).json({ message: 'Selected assignee was not found' });
    }

    assignedUserId = userId;
  }

  const task = await Task.create({
    title: normalizedTitle,
    description: normalizedDescription,
    status: status === 'completed' ? 'completed' : 'pending',
    priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
    dueDate: normalizedDueDate,
    userId: assignedUserId,
  });

  const populatedTask = await Task.findById(task._id).populate('userId', 'name email role');

  res.status(201).json({ task: populatedTask });
};

const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (!canAccessTask(task, req.user)) {
    return res.status(403).json({ message: 'Not authorized to update this task' });
  }

  const { title, description, status, priority, dueDate, userId } = req.body;

  if (title !== undefined) {
    const normalizedTitle = String(title).trim();
    if (normalizedTitle.length < 3) {
      return res.status(400).json({ message: 'Task title must be at least 3 characters long' });
    }
    task.title = normalizedTitle;
  }

  if (description !== undefined) {
    const normalizedDescription = String(description).trim();
    if (normalizedDescription.length < 10) {
      return res.status(400).json({ message: 'Task description must be at least 10 characters long' });
    }
    task.description = normalizedDescription;
  }

  if (status !== undefined) task.status = status === 'completed' ? 'completed' : 'pending';
  if (priority !== undefined && ['low', 'medium', 'high'].includes(priority)) task.priority = priority;
  if (dueDate !== undefined) {
    const normalizedDueDate = dueDate ? new Date(dueDate) : undefined;
    if (dueDate && Number.isNaN(normalizedDueDate?.getTime())) {
      return res.status(400).json({ message: 'Due date is invalid' });
    }
    task.dueDate = normalizedDueDate;
  }
  if (req.user.role === 'admin' && userId) {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Selected assignee is invalid' });
    }

    const assigneeExists = await User.findById(userId).select('_id');
    if (!assigneeExists) {
      return res.status(400).json({ message: 'Selected assignee was not found' });
    }

    task.userId = userId;
  }

  await task.save();
  const populatedTask = await Task.findById(task._id).populate('userId', 'name email role');

  res.json({ task: populatedTask });
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (!canAccessTask(task, req.user)) {
    return res.status(403).json({ message: 'Not authorized to delete this task' });
  }

  await task.deleteOne();
  res.json({ message: 'Task deleted successfully' });
};

const toggleTaskStatus = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (!canAccessTask(task, req.user)) {
    return res.status(403).json({ message: 'Not authorized to update this task' });
  }

  task.status = task.status === 'completed' ? 'pending' : 'completed';
  await task.save();

  const populatedTask = await Task.findById(task._id).populate('userId', 'name email role');
  res.json({ task: populatedTask });
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
};
