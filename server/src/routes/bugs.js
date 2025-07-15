const express = require('express');
const { check } = require('express-validator');
const { createBug, getBugs, getBugById, updateBug, deleteBug } = require('../controllers/bugController');

const router = express.Router();

router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('priority', 'Priority must be low, medium, or high').isIn(['low', 'medium', 'high']),
  ],
  createBug
);

router.get('/', getBugs);
router.get('/:id', getBugById);
router.put(
  '/:id',
  [
    check('title', 'Title is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty(),
    check('priority', 'Priority must be low, medium, or high').optional().isIn(['low', 'medium', 'high']),
    check('status', 'Status must be open, in-progress, or resolved').optional().isIn(['open', 'in-progress', 'resolved']),
  ],
  updateBug
);
router.delete('/:id', deleteBug);

module.exports = router;