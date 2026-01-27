const express = require('express');
const router = express.Router();

const homepageService = require('../../services/homepage.service');
const { auth, adminAuth } = require('../../middleware/auth');

// Public routes
router.get('/all-data', async (req, res, next) => {
  try {
    const result = await homepageService.getAllHomepageData();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/data', async (req, res, next) => {
  try {
    const result = await homepageService.getAllHomepageData();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/content', async (req, res, next) => {
  try {
    const result = await homepageService.getHomepageContent();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/featured-products', async (req, res, next) => {
  try {
    const query = {
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      page: req.query.page ? parseInt(req.query.page) : undefined,
      categoryId: req.query.categoryId,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };
    const result = await homepageService.getFeaturedProducts(query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/best-sellers', async (req, res, next) => {
  try {
    const query = {
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      page: req.query.page ? parseInt(req.query.page) : undefined,
      categoryId: req.query.categoryId,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };
    const result = await homepageService.getBestSellers(query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/new-arrivals', async (req, res, next) => {
  try {
    const query = {
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      page: req.query.page ? parseInt(req.query.page) : undefined,
      categoryId: req.query.categoryId,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };
    const result = await homepageService.getNewArrivals(query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/categories', async (req, res, next) => {
  try {
    const query = {
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      includeInactive: req.query.includeInactive === 'true',
    };
    const result = await homepageService.getActiveCategories(query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Protected routes (Admin only)
router.post('/content', auth, adminAuth, async (req, res, next) => {
  try {
    const result = await homepageService.createHomepageContent(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/content/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const result = await homepageService.updateHomepageContent(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/content/:id/with-images', auth, adminAuth, async (req, res, next) => {
  try {
    const result = await homepageService.updateHomepageContentWithImages(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
