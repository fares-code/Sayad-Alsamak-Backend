const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errorMessage,
      });
    }
    
    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(20).required(),
    password: Joi.string().min(6).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  category: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    nameAr: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(500).optional(),
    descriptionAr: Joi.string().max(500).optional(),
    image: Joi.string().uri().optional(),
    sortOrder: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
  }),

  product: Joi.object({
    // Basic info - matching CreateProductDto exactly
    name: Joi.string().min(2).max(200).optional(),
    nameAr: Joi.string().min(2).max(200).required(),
    descriptionAr: Joi.string().min(10).max(2000).optional(),
    categoryId: Joi.string().required(),
    
    // Product type enum
    type: Joi.string().valid('RETAIL', 'WHOLESALE', 'BOTH').optional(),
    
    // Pricing - exact validation from NestJS
    price: Joi.number().min(0).required(),
    originalPrice: Joi.number().min(0).optional(),
    discount: Joi.number().min(0).max(100).optional(),
    
    // Wholesale pricing - conditional validation handled in middleware
    wholesalePrice: Joi.number().min(0).optional(),
    minWholesaleQty: Joi.number().integer().min(1).optional(),
    
    // Physical properties
    weight: Joi.number().min(0).optional(),
    unit: Joi.string().required(),
    origin: Joi.string().optional(),
    
    // Inventory
    stock: Joi.number().integer().min(0).optional(),
    isAvailable: Joi.boolean().optional(),
    
    // Boolean flags
    isFeatured: Joi.boolean().optional(),
    isBestSeller: Joi.boolean().optional(),
    isNewArrival: Joi.boolean().optional(),
    
    // Images - exact validation from NestJS
    mainImage: Joi.string().required(),
    images: Joi.array().items(Joi.string()).max(10).optional(),
    
    // SEO fields - exact lengths from NestJS
    metaTitle: Joi.string().max(100).optional(),
    metaDescription: Joi.string().max(200).optional(),
    metaKeywords: Joi.array().items(Joi.string()).optional(),
  }),

  review: Joi.object({
    // Exact validation from CreateReviewDto
    productId: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(1000).optional(),
  }),

  contactMessage: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(20).required(),
    message: Joi.string().min(10).max(2000).required(),
  }),

  order: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    ).min(1).required(),
    address: Joi.object({
      fullName: Joi.string().required(),
      phone: Joi.string().required(),
      governorate: Joi.string().required(),
      city: Joi.string().required(),
      district: Joi.string().required(),
      street: Joi.string().required(),
      buildingNo: Joi.string().optional(),
      floor: Joi.string().optional(),
      apartment: Joi.string().optional(),
      landmark: Joi.string().optional(),
    }).required(),
    paymentMethod: Joi.string().valid('CASH_ON_DELIVERY', 'CREDIT_CARD', 'MOBILE_WALLET').required(),
    deliveryDate: Joi.string().optional(),
    deliveryTime: Joi.string().optional(),
    customerNotes: Joi.string().max(1000).optional(),
  }),
};

module.exports = {
  validate,
  schemas,
};
