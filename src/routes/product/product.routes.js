const express = require('express');
const router = express.Router();

const productService = require('../../services/product.service');
const { validate, schemas } = require('../../middleware/validation');
const { validateProductWholesalePricing } = require('../../middleware/productValidation');
const { auth, adminAuth } = require('../../middleware/auth');

// Public routes
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      categoryId: req.query.categoryId,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
      isFeatured: req.query.isFeatured ? req.query.isFeatured === 'true' : undefined,
      isBestSeller: req.query.isBestSeller ? req.query.isBestSeller === 'true' : undefined,
      isNewArrival: req.query.isNewArrival ? req.query.isNewArrival === 'true' : undefined,
      type: req.query.type,
      search: req.query.search,
      sortBy: req.query.sortBy,
      page: req.query.page ? parseInt(req.query.page) : 1,
      limit: req.query.limit ? parseInt(req.query.limit) : 12,
    };

    const result = await productService.findAll(filters);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/slug/:slug', async (req, res, next) => {
  try {
    const product = await productService.findBySlug(req.params.slug);
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/related/:id', async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 4;
    const products = await productService.getRelatedProducts(req.params.id, limit);
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/stats/overview', auth, adminAuth, async (req, res, next) => {
  try {
    const stats = await productService.getStatistics();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await productService.findOne(req.params.id);
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// Reviews routes
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const reviews = await productService.getProductReviews(req.params.id);
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/reviews', validate(schemas.review), async (req, res, next) => {
  try {
    const reviewData = {
      productId: req.params.id,
      ...req.body,
    };
    const review = await productService.createReview(reviewData);
    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes (Admin only)
router.post('/', auth, adminAuth, validate(schemas.product), validateProductWholesalePricing, async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', auth, adminAuth, validate(schemas.product), validateProductWholesalePricing, async (req, res, next) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const result = await productService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/stock', auth, adminAuth, async (req, res, next) => {
  try {
    const { stock } = req.body;
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        success: false,
        error: 'المخزون يجب أن يكون رقم موجب',
      });
    }
    const result = await productService.updateStock(req.params.id, stock);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

// Review management (Admin only)
router.patch('/reviews/:reviewId/approve', auth, adminAuth, async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const review = await productService.approveReview(req.params.reviewId, isApproved);
    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/reviews/:reviewId', auth, adminAuth, async (req, res, next) => {
  try {
    const result = await productService.deleteReview(req.params.reviewId);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
