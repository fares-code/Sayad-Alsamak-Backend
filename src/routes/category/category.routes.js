const express = require('express');
const router = express.Router();

const categoryService = require('../../services/category.service');
const { validate, schemas } = require('../../middleware/validation');
const { auth, adminAuth } = require('../../middleware/auth');

// Public routes
router.get('/', async (req, res, next) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const categories = await categoryService.findAll(includeInactive);
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const category = await categoryService.findOne(req.params.id);
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/stats/overview', auth, adminAuth, async (req, res, next) => {
  try {
    const stats = await categoryService.getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes (Admin only)
router.post('/', auth, adminAuth, validate(schemas.category), async (req, res, next) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth, adminAuth, validate(schemas.category), async (req, res, next) => {
  try {
    const category = await categoryService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const result = await categoryService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/toggle-active', auth, adminAuth, async (req, res, next) => {
  try {
    const category = await categoryService.toggleActive(req.params.id);
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
