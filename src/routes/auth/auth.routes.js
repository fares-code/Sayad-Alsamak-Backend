const express = require('express');
const router = express.Router();

const authService = require('../../services/auth.service');
const { validate, schemas } = require('../../middleware/validation');
const { auth } = require('../../middleware/auth');

// Public routes
router.post('/register', validate(schemas.register), async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(schemas.login), async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.get('/profile', auth, async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const result = await authService.getCurrentUser(req.user.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
