const { prisma } = require('../config/database');
const cloudinaryService = require('./cloudinary.service');

class HomepageService {
  async getFeaturedProducts(query = {}) {
    try {
      const limit = query.limit || 8;
      const page = query.page || 1;
      const skip = (page - 1) * limit;

      const products = await prisma.product.findMany({
        where: {
          isFeatured: true,
          isAvailable: true,
          ...(query.categoryId && { categoryId: query.categoryId }),
        },
        select: {
          id: true,
          nameAr: true,
          descriptionAr: true,
          price: true,
          originalPrice: true,
          discount: true,
          mainImage: true,
          weight: true,
          unit: true,
          category: {
            select: {
              nameAr: true,
            },
          },
        },
        orderBy: this.buildOrderBy(query.sortBy, query.sortOrder),
        take: limit,
        skip: skip,
      });

      return {
        success: true,
        data: products,
        count: products.length,
      };
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return {
        success: false,
        data: [],
        count: 0,
      };
    }
  }

  async getBestSellers(query = {}) {
    try {
      const limit = query.limit || 8;
      const page = query.page || 1;
      const skip = (page - 1) * limit;

      const products = await prisma.product.findMany({
        where: {
          isBestSeller: true,
          isAvailable: true,
          ...(query.categoryId && { categoryId: query.categoryId }),
        },
        select: {
          id: true,
          nameAr: true,
          descriptionAr: true,
          price: true,
          originalPrice: true,
          discount: true,
          mainImage: true,
          weight: true,
          unit: true,
          salesCount: true,
          category: {
            select: {
              nameAr: true,
            },
          },
        },
        orderBy: {
          salesCount: 'desc',
        },
        take: limit,
        skip: skip,
      });

      return {
        success: true,
        data: products,
        count: products.length,
      };
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      return {
        success: false,
        data: [],
        count: 0,
      };
    }
  }

  async getNewArrivals(query = {}) {
    try {
      const limit = query.limit || 8;
      const page = query.page || 1;
      const skip = (page - 1) * limit;

      const products = await prisma.product.findMany({
        where: {
          isNewArrival: true,
          isAvailable: true,
          ...(query.categoryId && { categoryId: query.categoryId }),
        },
        select: {
          id: true,
          nameAr: true,
          descriptionAr: true,
          price: true,
          originalPrice: true,
          discount: true,
          mainImage: true,
          weight: true,
          unit: true,
          category: {
            select: {
              nameAr: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: skip,
      });

      return {
        success: true,
        data: products,
        count: products.length,
      };
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      return {
        success: false,
        data: [],
        count: 0,
      };
    }
  }

  async getActiveCategories(query = {}) {
    try {
      const categories = await prisma.category.findMany({
        where: {
          isActive: query.includeInactive ? undefined : true,
        },
        select: {
          id: true,
          nameAr: true,
          image: true,
          descriptionAr: true,
          sortOrder: true,
        },
        orderBy: {
          sortOrder: 'asc',
        },
        ...(query.limit && { take: query.limit }),
      });

      return {
        success: true,
        data: categories,
        count: categories.length,
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        data: [],
        count: 0,
      };
    }
  }

  async getAllHomepageData() {
    try {
      const [featuredResult, bestSellersResult, categoriesResult] = await Promise.all([
        this.getFeaturedProducts(),
        this.getBestSellers(),
        this.getActiveCategories(),
      ]);

      const homepageData = {
        featuredProducts: featuredResult.data || [],
        bestSellers: bestSellersResult.data || [],
        categories: categoriesResult.data || [],
      };

      return {
        success: true,
        data: homepageData,
      };
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      return {
        success: false,
        data: {
          featuredProducts: [],
          bestSellers: [],
          categories: [],
        },
      };
    }
  }

  async getHomepageContent() {
    try {
      let content = await prisma.homepageContent.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      // If no content exists, create default content
      if (!content) {
        console.log('No homepage content found, creating default content');
        content = await prisma.homepageContent.create({
          data: {
            heroTitle: 'صياد السمك يقدم لك أجود المأكولات البحرية الطازجة من البحر إلى مائدتك',
            heroDescription: 'أفضل المأكولات البحرية بجودة عالية ونضارة لا مثيل لها – سمك طازج، جمبري، كابوريا، منتجات مُعدّة للطهي والمزيد بأسعار تنافسية وخدمة توصيل سريعة.',
            heroButtonText1: 'عرض المنتجات',
            heroButtonText2: 'اطلب بالجملة',
            heroButtonLink1: '/products',
            heroButtonLink2: '/products?type=WHOLESALE',
            sectionTwoTitle: 'الأصناف الشائعة',
            sectionTwoDescription: 'المفضلة لدى عملائنا',
            sectionThreeTitle: 'المنتجات المميزة',
            sectionFourTitle: 'نوفر جميع المنتجات اللازمة بأفضل جودة للمطاعم و الفنادق لطلبات الجملة',
            sectionFourDescription: 'زود مطعمك أفضل و أجود المنتجات البحرية الطازجة الآن',
            sectionFourButtonText: 'اطلب الآن',
            sectionFourButtonLink: '/products?type=WHOLESALE',
            isActive: true,
          }
        });
      }

      return {
        success: true,
        data: {
          id: content.id,
          heroTitle: content.heroTitle || undefined,
          heroDescription: content.heroDescription || undefined,
          heroButtonText1: content.heroButtonText1 || undefined,
          heroButtonText2: content.heroButtonText2 || undefined,
          heroButtonLink1: content.heroButtonLink1 || undefined,
          heroButtonLink2: content.heroButtonLink2 || undefined,
          heroBackgroundImage1: content.heroBackgroundImage1 || undefined,
          heroBackgroundImage2: content.heroBackgroundImage2 || undefined,
          sectionTwoTitle: content.sectionTwoTitle || undefined,
          sectionTwoDescription: content.sectionTwoDescription || undefined,
          sectionThreeTitle: content.sectionThreeTitle || undefined,
          sectionFourTitle: content.sectionFourTitle || undefined,
          sectionFourDescription: content.sectionFourDescription || undefined,
          sectionFourButtonText: content.sectionFourButtonText || undefined,
          sectionFourButtonLink: content.sectionFourButtonLink || undefined,
          sectionFourImage: content.sectionFourImage || undefined,
          isActive: content.isActive,
        }
      };
    } catch (error) {
      console.error('Error fetching homepage content:', error);
      throw error;
    }
  }

  async createHomepageContent(createData) {
    try {
      // Deactivate all existing content
      await prisma.homepageContent.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });

      // Remove id from data (if it exists)
      const { id, ...dataWithoutId } = createData;
      const processedData = { ...dataWithoutId };

      // Upload images if they are base64 strings
      const imageFields = ['heroBackgroundImage1', 'heroBackgroundImage2', 'sectionFourImage'];

      for (const field of imageFields) {
        const value = processedData[field];
        if (value && typeof value === 'string' && value.startsWith('data:image')) {
          try {
            processedData[field] = await this.uploadImage(value);
          } catch (error) {
            console.warn(`Failed to upload ${field}, keeping original value:`, error);
          }
        }
      }

      const content = await prisma.homepageContent.create({
        data: {
          ...processedData,
          isActive: true,
        },
      });

      return {
        success: true,
        data: {
          id: content.id,
          heroTitle: content.heroTitle || undefined,
          heroDescription: content.heroDescription || undefined,
          heroButtonText1: content.heroButtonText1 || undefined,
          heroButtonText2: content.heroButtonText2 || undefined,
          heroButtonLink1: content.heroButtonLink1 || undefined,
          heroButtonLink2: content.heroButtonLink2 || undefined,
          heroBackgroundImage1: content.heroBackgroundImage1 || undefined,
          heroBackgroundImage2: content.heroBackgroundImage2 || undefined,
          sectionTwoTitle: content.sectionTwoTitle || undefined,
          sectionTwoDescription: content.sectionTwoDescription || undefined,
          sectionThreeTitle: content.sectionThreeTitle || undefined,
          sectionFourTitle: content.sectionFourTitle || undefined,
          sectionFourDescription: content.sectionFourDescription || undefined,
          sectionFourButtonText: content.sectionFourButtonText || undefined,
          sectionFourButtonLink: content.sectionFourButtonLink || undefined,
          sectionFourImage: content.sectionFourImage || undefined,
          isActive: content.isActive,
        },
        message: 'Homepage content created successfully'
      };
    } catch (error) {
      console.error('Error creating homepage content:', error);
      throw error;
    }
  }

  async updateHomepageContent(id, updateData) {
    try {
      // Remove id from data (if it exists)
      const { id: _, ...dataWithoutId } = updateData;

      const content = await prisma.homepageContent.update({
        where: { id },
        data: dataWithoutId,
      });

      return {
        success: true,
        data: {
          id: content.id,
          heroTitle: content.heroTitle || undefined,
          heroDescription: content.heroDescription || undefined,
          heroButtonText1: content.heroButtonText1 || undefined,
          heroButtonText2: content.heroButtonText2 || undefined,
          heroButtonLink1: content.heroButtonLink1 || undefined,
          heroButtonLink2: content.heroButtonLink2 || undefined,
          heroBackgroundImage1: content.heroBackgroundImage1 || undefined,
          heroBackgroundImage2: content.heroBackgroundImage2 || undefined,
          sectionTwoTitle: content.sectionTwoTitle || undefined,
          sectionTwoDescription: content.sectionTwoDescription || undefined,
          sectionThreeTitle: content.sectionThreeTitle || undefined,
          sectionFourTitle: content.sectionFourTitle || undefined,
          sectionFourDescription: content.sectionFourDescription || undefined,
          sectionFourButtonText: content.sectionFourButtonText || undefined,
          sectionFourButtonLink: content.sectionFourButtonLink || undefined,
          sectionFourImage: content.sectionFourImage || undefined,
          isActive: content.isActive,
        },
        message: 'Homepage content updated successfully'
      };
    } catch (error) {
      console.error('Error updating homepage content:', error);
      throw error;
    }
  }

  async updateHomepageContentWithImages(id, updateData) {
    try {
      // Remove id from data (if it exists)
      const { id: _, ...dataWithoutId } = updateData;
      const processedData = { ...dataWithoutId };

      // Upload images if they are base64 strings
      const imageFields = ['heroBackgroundImage1', 'heroBackgroundImage2', 'sectionFourImage'];

      for (const field of imageFields) {
        const value = processedData[field];
        if (value && typeof value === 'string' && value.startsWith('data:image')) {
          try {
            processedData[field] = await this.uploadImage(value);
          } catch (error) {
            console.warn(`Failed to upload ${field}, keeping original value:`, error);
            // Remove the field from update if upload failed
            delete processedData[field];
          }
        }
      }

      const content = await prisma.homepageContent.update({
        where: { id },
        data: processedData,
      });

      return {
        success: true,
        data: {
          id: content.id,
          heroTitle: content.heroTitle || undefined,
          heroDescription: content.heroDescription || undefined,
          heroButtonText1: content.heroButtonText1 || undefined,
          heroButtonText2: content.heroButtonText2 || undefined,
          heroButtonLink1: content.heroButtonLink1 || undefined,
          heroButtonLink2: content.heroButtonLink2 || undefined,
          heroBackgroundImage1: content.heroBackgroundImage1 || undefined,
          heroBackgroundImage2: content.heroBackgroundImage2 || undefined,
          sectionTwoTitle: content.sectionTwoTitle || undefined,
          sectionTwoDescription: content.sectionTwoDescription || undefined,
          sectionThreeTitle: content.sectionThreeTitle || undefined,
          sectionFourTitle: content.sectionFourTitle || undefined,
          sectionFourDescription: content.sectionFourDescription || undefined,
          sectionFourButtonText: content.sectionFourButtonText || undefined,
          sectionFourButtonLink: content.sectionFourButtonLink || undefined,
          sectionFourImage: content.sectionFourImage || undefined,
          isActive: content.isActive,
        },
        message: 'Homepage content updated successfully with images'
      };
    } catch (error) {
      console.error('Error updating homepage content with images:', error);
      throw error;
    }
  }

  async uploadImage(base64, folder = 'homepage') {
    try {
      return await cloudinaryService.uploadImageFromBase64(base64, folder);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`فشل رفع الصورة: ${error.message}`);
    }
  }

  buildOrderBy(sortBy, sortOrder) {
    const order = sortOrder === 'asc' ? 'asc' : 'desc';
    
    switch (sortBy) {
      case 'price':
        return { price: order };
      case 'salesCount':
        return { salesCount: order };
      case 'name':
        return { nameAr: order };
      case 'createdAt':
      default:
        return { createdAt: order };
    }
  }
}

module.exports = new HomepageService();
