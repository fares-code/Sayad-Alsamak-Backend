const express = require('express');
const router = express.Router();

const aboutUsService = require('../../services/about-us.service');
const { auth, adminAuth } = require('../../middleware/auth');

// Public routes
router.get('/active', async (req, res, next) => {
  try {
    const content = await aboutUsService.getActive();
    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes (Admin only)
router.post('/', auth, adminAuth, async (req, res, next) => {
  try {
    const content = await aboutUsService.create(req.body);
    res.status(201).json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', auth, adminAuth, async (req, res, next) => {
  try {
    // Get all about-us content records
    const { prisma } = require('../../config/database');
    const contents = await prisma.aboutUsContent.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: contents,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const content = await aboutUsService.findOne(req.params.id);
    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const content = await aboutUsService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const result = await aboutUsService.remove(req.params.id);
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
    const content = await aboutUsService.toggleActive(req.params.id);
    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
