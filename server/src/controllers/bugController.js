const { validationResult } = require('express-validator');
const Bug = require('../models/Bug');

const validateStatusTransition = (currentStatus, newStatus) => {
  console.log('Validating status transition:', { currentStatus, newStatus });
  if (currentStatus === 'resolved' && newStatus === 'open') {
    console.warn('Invalid transition from resolved to open');
    return false;
  }
  return true;
};

exports.createBug = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority } = req.body;
    console.log('Creating bug:', { title, description, priority });

    const bug = new Bug({
      title,
      description,
      priority,
      createdBy: 'testuser', // Mock user
    });

    const savedBug = await bug.save();
    res.status(201).json(savedBug);
  } catch (err) {
    next(err);
  }
};

exports.getBugs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};
    const bugs = await Bug.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.status(200).json(bugs);
  } catch (err) {
    next(err);
  }
};

exports.getBugById = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    res.status(200).json(bug);
  } catch (err) {
    next(err);
  }
};

exports.updateBug = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    const { title, description, priority, status } = req.body;
    if (status && !validateStatusTransition(bug.status, status)) {
      return res.status(400).json({ error: 'Invalid status transition' });
    }

    bug.title = title || bug.title;
    bug.description = description || bug.description;
    bug.priority = priority || bug.priority;
    bug.status = status || bug.status;

    const updatedBug = await bug.save();
    res.status(200).json(updatedBug);
  } catch (err) {
    next(err);
  }
};

exports.deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    await bug.deleteOne();
    res.status(200).json({ message: 'Bug deleted' });
  } catch (err) {
    next(err);
  }
};