const express = require('express');
const router = express.Router();

const contactInfoService = require('../../services/contact-info.service');
const { auth, adminAuth } = require('../../middleware/auth');

// Public routes
router.get('/active', async (req, res, next) => {
  try {
    const contactInfo = await contactInfoService.getActive();
    res.status(200).json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes (Admin only)
router.post('/', auth, adminAuth, async (req, res, next) => {
  try {
    const contactInfo = await contactInfoService.create(req.body);
    res.status(201).json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', auth, adminAuth, async (req, res, next) => {
  try {
    // Get all contact info records
    const { prisma } = require('../../config/database');
    const contactInfos = await prisma.contactInfo.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: contactInfos,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const contactInfo = await contactInfoService.findOne(req.params.id);
    res.status(200).json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const contactInfo = await contactInfoService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/toggle-active', auth, adminAuth, async (req, res, next) => {
  try {
    const contactInfo = await contactInfoService.toggleActive(req.params.id);
    res.status(200).json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
