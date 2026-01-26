const express = require('express');
const router = express.Router();

const orderService = require('../../services/order.service');
const { validate, schemas } = require('../../middleware/validation');
const { auth, adminAuth } = require('../../middleware/auth');

// Public routes
router.get('/number/:orderNumber', async (req, res, next) => {
  try {
    const order = await orderService.getOrderByNumber(req.params.orderNumber);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes (Admin only)
router.get('/', auth, adminAuth, async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/status/:status', auth, adminAuth, async (req, res, next) => {
  try {
    const orders = await orderService.getOrdersByStatus(req.params.status);
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', validate(schemas.order), async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', auth, adminAuth, async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/payment-status', auth, adminAuth, async (req, res, next) => {
  try {
    const order = await orderService.updatePaymentStatus(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
