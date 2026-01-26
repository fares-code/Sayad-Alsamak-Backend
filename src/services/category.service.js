const { prisma } = require('../config/database');
const cloudinaryService = require('./cloudinary.service');

class CategoryService {
  async create(categoryData) {
    // Check for duplicate category name
    const existingByName = await prisma.category.findFirst({
      where: {
        OR: [
          { name: categoryData.name },
        ],
      },
    });

    if (existingByName) {
      throw new Error('الفئة موجودة بالفعل بنفس الاسم');
    }

    // Upload image to Cloudinary if exists
    let imageUrl;
    if (categoryData.image && this.isBase64Image(categoryData.image)) {
      try {
        imageUrl = await cloudinaryService.uploadImageFromBase64(
          categoryData.image,
          'categories'
        );
      } catch (error) {
        throw new Error('فشل رفع الصورة: ' + error.message);
      }
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        ...categoryData,
        image: imageUrl || categoryData.image,
      },
    });

    return this.formatCategoryResponse(category);
  }

  async findAll(includeInactive = false) {
    const categories = await prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return categories.map((category) => ({
      ...this.formatCategoryResponse(category),
      productsCount: category._count.products,
    }));
  }

  async findOne(id) {
    this.validateObjectId(id);

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new Error('الفئة غير موجودة');
    }

    return {
      ...this.formatCategoryResponse(category),
      productsCount: category._count.products,
    };
  }

  async update(id, updateData) {
    this.validateObjectId(id);

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new Error('الفئة غير موجودة');
    }

    // Check for duplicate name
    if (updateData.name) {
      const duplicate = await prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { name: updateData.name },
          ],
        },
      });

      if (duplicate) {
        throw new Error('الفئة موجودة بالفعل بنفس الاسم');
      }
    }

    // Upload new image to Cloudinary if updated
    let imageUrl;
    if (updateData.image && this.isBase64Image(updateData.image)) {
      try {
        imageUrl = await cloudinaryService.uploadImageFromBase64(
          updateData.image,
          'categories'
        );
      } catch (error) {
        throw new Error('فشل رفع الصورة: ' + error.message);
      }
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...updateData,
        image: imageUrl || updateData.image,
      },
    });

    return this.formatCategoryResponse(category);
  }

  async remove(id) {
    this.validateObjectId(id);

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new Error('الفئة غير موجودة');
    }

    // Check if category has products
    if (category._count.products > 0) {
      throw new Error(
        `لا يمكن حذف الفئة لأنها تحتوي على ${category._count.products} منتج`
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return { message: 'تم حذف الفئة بنجاح' };
  }

  async toggleActive(id) {
    this.validateObjectId(id);

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error('الفئة غير موجودة');
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { isActive: !category.isActive },
    });

    return this.formatCategoryResponse(updated);
  }

  async getStats() {
    const [total, active, inactive] = await Promise.all([
      prisma.category.count(),
      prisma.category.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: false } }),
    ]);

    return {
      total,
      active,
      inactive,
    };
  }

  formatCategoryResponse(category) {
    return {
      id: category.id,
      name: category.name,
      nameAr: category.nameAr,
      description: category.description,
      descriptionAr: category.descriptionAr,
      image: category.image,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
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

module.exports = new CategoryService();
