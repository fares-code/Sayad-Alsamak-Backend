const { prisma } = require('../config/database');
const cloudinaryService = require('./cloudinary.service');

class ProductService {
  async create(productData) {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: productData.categoryId },
    });

    if (!category) {
      throw new Error('الفئة غير موجودة');
    }

    // Validate wholesale pricing
    this.validateWholesalePricing(productData);

    // Upload main image
    let mainImageUrl;
    try {
      mainImageUrl = await cloudinaryService.uploadImageFromBase64(
        productData.mainImage,
        'products',
        `product_${productData.nameAr}_main`
      );
    } catch (error) {
      throw new Error('فشل رفع الصورة الرئيسية: ' + error.message);
    }

    // Upload additional images
    let additionalImagesUrls = [];
    if (productData.images && productData.images.length > 0) {
      try {
        additionalImagesUrls = await this.uploadMultipleImages(
          productData.images,
          productData.nameAr
        );
      } catch (error) {
        throw new Error('فشل رفع الصور الإضافية: ' + error.message);
      }
    }

    // Create product
    const { type, ...data } = productData;
    const product = await prisma.product.create({
      data: {
        ...data,
        mainImage: mainImageUrl,
        images: additionalImagesUrls,
        metaKeywords: productData.metaKeywords || [],
        type: type || 'RETAIL',
        wholesalePrice: productData.wholesalePrice,
        minWholesaleQty: productData.minWholesaleQty,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          },
        },
      },
    });

    return this.formatProductResponse(product);
  }

  async findAll(filters) {
    const {
      categoryId,
      minPrice,
      maxPrice,
      isFeatured,
      isBestSeller,
      isNewArrival,
      type,
      search,
      sortBy = 'createdAt_desc',
      page = 1,
      limit = 12,
    } = filters;

    // Build where conditions
    const where = {
      isAvailable: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (type) {
      where.type = type;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (isBestSeller !== undefined) {
      where.isBestSeller = isBestSeller;
    }

    if (isNewArrival !== undefined) {
      where.isNewArrival = isNewArrival;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy = this.buildOrderBy(sortBy);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              nameAr: true,
            },
          },
          reviews: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 10,
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products.map((product) => this.formatProductResponse(product)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug) {
    const product = await prisma.product.findFirst({
      where: { 
        nameAr: slug 
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          },
        },
        reviews: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new Error('المنتج غير موجود');
    }

    await this.incrementViews(product.id);

    return this.formatProductResponse(product);
  }

  async findOne(id) {
    this.validateObjectId(id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error('المنتج غير موجود');
    }

    await this.incrementViews(id);

    return this.formatProductResponse(product);
  }

  async getRelatedProducts(id, limit = 4) {
    this.validateObjectId(id);

    const product = await prisma.product.findUnique({
      where: { id },
      select: { categoryId: true },
    });

    if (!product) {
      throw new Error('المنتج غير موجود');
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: id },
        isAvailable: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          },
        },
      },
      take: limit,
      orderBy: {
        views: 'desc',
      },
    });

    return relatedProducts.map((p) => this.formatProductResponse(p));
  }

  async update(id, updateData) {
    this.validateObjectId(id);

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error('المنتج غير موجود');
    }

    if (updateData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: updateData.categoryId },
      });

      if (!category) {
        throw new Error('الفئة غير موجودة');
      }
    }

    this.validateWholesalePricing(updateData);

    let mainImageUrl;
    if (updateData.mainImage && this.isBase64Image(updateData.mainImage)) {
      try {
        mainImageUrl = await cloudinaryService.uploadImageFromBase64(
          updateData.mainImage,
          'products',
          `product_${updateData.nameAr || existingProduct.nameAr}_main`
        );
      } catch (error) {
        throw new Error('فشل رفع الصورة الرئيسية: ' + error.message);
      }
    }

    let additionalImagesUrls;
    if (updateData.images && updateData.images.length > 0) {
      const newImages = updateData.images.filter((img) =>
        this.isBase64Image(img)
      );
      const existingImages = updateData.images.filter(
        (img) => !this.isBase64Image(img)
      );

      if (newImages.length > 0) {
        try {
          const uploadedImages = await this.uploadMultipleImages(
            newImages,
            updateData.nameAr || existingProduct.nameAr
          );
          additionalImagesUrls = [...existingImages, ...uploadedImages];
        } catch (error) {
          throw new Error('فشل رفع الصور الإضافية: ' + error.message);
        }
      } else {
        additionalImagesUrls = existingImages;
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        mainImage: mainImageUrl || updateData.mainImage,
        images: additionalImagesUrls || updateData.images,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          },
        },
      },
    });

    return this.formatProductResponse(product);
  }

  async remove(id) {
    this.validateObjectId(id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error('المنتج غير موجود');
    }

    if (product._count.orderItems > 0) {
      throw new Error(
        'لا يمكن حذف المنتج لأنه مرتبط بطلبات موجودة'
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return { message: 'تم حذف المنتج بنجاح' };
  }

  async updateStock(id, stock) {
    this.validateObjectId(id);

    const product = await prisma.product.update({
      where: { id },
      data: {
        stock,
        isAvailable: stock > 0,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          },
        },
      },
    });

    return {
      message: 'تم تحديث المخزون بنجاح',
      data: this.formatProductResponse(product),
    };
  }

  async getStatistics() {
    const [
      total,
      available,
      outOfStock,
      featured,
      bestSeller,
      newArrival,
      totalViews,
      retailProducts,
      wholesaleProducts,
      bothProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isAvailable: true } }),
      prisma.product.count({ where: { stock: 0 } }),
      prisma.product.count({ where: { isFeatured: true } }),
      prisma.product.count({ where: { isBestSeller: true } }),
      prisma.product.count({ where: { isNewArrival: true } }),
      prisma.product.aggregate({
        _sum: { views: true },
      }),
      prisma.product.count({ where: { type: 'RETAIL' } }),
      prisma.product.count({ where: { type: 'WHOLESALE' } }),
      prisma.product.count({ where: { type: 'BOTH' } }),
    ]);

    return {
      total,
      available,
      outOfStock,
      featured,
      bestSeller,
      newArrival,
      totalViews: totalViews._sum.views || 0,
      byType: {
        retail: retailProducts,
        wholesale: wholesaleProducts,
        both: bothProducts,
      },
    };
  }

  async createReview(reviewData) {
    const { productId, rating, comment } = reviewData;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('المنتج غير موجود');
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId,
        rating,
        comment,
        isApproved: true,
      },
    });

    // Update product rating
    await this.updateProductRating(productId);

    return this.formatReviewResponse(review);
  }

  async getProductReviews(productId) {
    this.validateObjectId(productId);

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews.map((review) => this.formatReviewResponse(review));
  }

  async approveReview(reviewId, isApproved) {
    this.validateObjectId(reviewId);

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error('التقييم غير موجود');
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved },
    });

    await this.updateProductRating(review.productId);

    return this.formatReviewResponse(updatedReview);
  }

  async deleteReview(reviewId) {
    this.validateObjectId(reviewId);

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error('التقييم غير موجود');
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    await this.updateProductRating(review.productId);

    return { message: 'تم حذف التقييم بنجاح' };
  }

  validateWholesalePricing(dto) {
    const type = dto.type;
    const wholesalePrice = dto.wholesalePrice;
    const minWholesaleQty = dto.minWholesaleQty;

    if ((type === 'WHOLESALE' || type === 'BOTH') && 
        (wholesalePrice === undefined || minWholesaleQty === undefined)) {
      throw new Error(
        'يجب تحديد سعر الجملة والحد الأدنى للكمية عند اختيار نوع جملة'
      );
    }

    if (wholesalePrice && dto.price && wholesalePrice >= dto.price) {
      throw new Error(
        'سعر الجملة يجب أن يكون أقل من سعر القطاعي'
      );
    }

    if (minWholesaleQty && minWholesaleQty < 1) {
      throw new Error(
        'الحد الأدنى لكمية الجملة يجب أن يكون أكبر من 1'
      );
    }
  }

  async uploadMultipleImages(images, nameAr) {
    const uploadPromises = images.map((image, index) => {
      if (this.isBase64Image(image)) {
        return cloudinaryService.uploadImageFromBase64(
          image,
          'products',
          `product_${nameAr}_${index + 1}`
        );
      }
      return Promise.resolve(image);
    });

    return Promise.all(uploadPromises);
  }

  async incrementViews(id) {
    await prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  buildOrderBy(sortBy) {
    const sortOptions = {
      price_asc: { price: 'asc' },
      price_desc: { price: 'desc' },
      name_asc: { name: 'asc' },
      name_desc: { name: 'desc' },
      newest: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
      popular: { views: 'desc' },
      rating: { averageRating: 'desc' },
      createdAt_desc: { createdAt: 'desc' },
    };

    return sortOptions[sortBy] || sortOptions.createdAt_desc;
  }

  formatProductResponse(product) {
    return {
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      descriptionAr: product.descriptionAr,
      categoryId: product.categoryId,
      type: product.type,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      wholesalePrice: product.wholesalePrice,
      minWholesaleQty: product.minWholesaleQty,
      weight: product.weight,
      unit: product.unit,
      origin: product.origin,
      stock: product.stock,
      isAvailable: product.isAvailable,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival,
      mainImage: product.mainImage,
      images: product.images,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      metaKeywords: product.metaKeywords,
      views: product.views,
      salesCount: product.salesCount,
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: product.category,
    };
  }

  formatReviewResponse(review) {
    return {
      id: review.id,
      productId: review.productId,
      rating: review.rating,
      comment: review.comment,
      isApproved: review.isApproved,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  async updateProductRating(productId) {
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      select: {
        rating: true,
      },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
      },
    });
  }

  validateObjectId(id) {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(id)) {
      throw new Error('معرف غير صالح');
    }
  }

  isBase64Image(str) {
    return str.startsWith('data:image/');
  }
}

module.exports = new ProductService();
