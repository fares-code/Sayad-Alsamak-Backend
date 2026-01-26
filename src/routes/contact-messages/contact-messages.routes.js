const express = require('express');
const router = express.Router();

const contactMessagesService = require('../../services/contact-messages.service');
const { validate, schemas } = require('../../middleware/validation');
const { auth, adminAuth } = require('../../middleware/auth');

// Public routes
router.post('/', validate(schemas.contactMessage), async (req, res, next) => {
  try {
    const message = await contactMessagesService.create(req.body);
    res.status(201).json({
      success: true,
      data: message,
      message: 'تم إرسال الرسالة بنجاح',
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes (Admin only)
router.get('/', auth, adminAuth, async (req, res, next) => {
  try {
    const filters = {
      isRead: req.query.isRead ? req.query.isRead === 'true' : undefined,
      isReplied: req.query.isReplied ? req.query.isReplied === 'true' : undefined,
    };
    const messages = await contactMessagesService.findAll(filters);
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/stats/overview', auth, adminAuth, async (req, res, next) => {
  try {
    const stats = await contactMessagesService.getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const message = await contactMessagesService.findOne(req.params.id);
    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const message = await contactMessagesService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/mark-read', auth, adminAuth, async (req, res, next) => {
  try {
    const message = await contactMessagesService.markAsRead(req.params.id);
    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/mark-replied', auth, adminAuth, async (req, res, next) => {
  try {
    const message = await contactMessagesService.markAsReplied(req.params.id);
    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const result = await contactMessagesService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
