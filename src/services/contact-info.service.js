const { prisma } = require('../config/database');
const cloudinaryService = require('./cloudinary.service');

class ContactInfoService {
  async create(infoData) {
    const existing = await prisma.contactInfo.findFirst();
    if (existing) {
      throw new Error('المعلومات موجودة بالفعل. استخدم التحديث');
    }

    // Upload image to Cloudinary
    let heroImage;
    if (this.isBase64Image(infoData.heroImage)) {
      try {
        heroImage = await cloudinaryService.uploadImageFromBase64(
          infoData.heroImage,
          'contact',
          'contact-hero'
        );
      } catch (error) {
        throw new Error('فشل رفع الصورة: ' + error.message);
      }
    }

    const contactInfo = await prisma.contactInfo.create({
      data: {
        ...infoData,
        heroImage: heroImage || infoData.heroImage,
      },
    });

    return this.formatResponse(contactInfo);
  }

  async getActive() {
    const contactInfo = await prisma.contactInfo.findFirst({
      where: { isActive: true },
    });

    if (!contactInfo) {
      throw new Error('لا توجد معلومات اتصال نشطة');
    }

    return this.formatResponse(contactInfo);
  }

  async findOne(id) {
    this.validateObjectId(id);

    const contactInfo = await prisma.contactInfo.findUnique({
      where: { id },
    });

    if (!contactInfo) {
      throw new Error('المعلومات غير موجودة');
    }

    return this.formatResponse(contactInfo);
  }

  async update(id, updateData) {
    this.validateObjectId(id);

    const existing = await prisma.contactInfo.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('المعلومات غير موجودة');
    }

    // Upload new image if updated
    let heroImage;
    if (updateData.heroImage && this.isBase64Image(updateData.heroImage)) {
      try {
        heroImage = await cloudinaryService.uploadImageFromBase64(
          updateData.heroImage,
          'contact',
          'contact-hero'
        );
      } catch (error) {
        throw new Error('فشل رفع الصورة: ' + error.message);
      }
    }

    const contactInfo = await prisma.contactInfo.update({
      where: { id },
      data: {
        ...updateData,
        heroImage: heroImage || updateData.heroImage,
      },
    });

    return this.formatResponse(contactInfo);
  }

  async toggleActive(id) {
    this.validateObjectId(id);

    const contactInfo = await prisma.contactInfo.findUnique({
      where: { id },
    });

    if (!contactInfo) {
      throw new Error('المعلومات غير موجودة');
    }

    const updated = await prisma.contactInfo.update({
      where: { id },
      data: { isActive: !contactInfo.isActive },
    });

    return this.formatResponse(updated);
  }

  isBase64Image(str) {
    return str.startsWith('data:image/');
  }

  validateObjectId(id) {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(id)) {
      throw new Error('معرف غير صالح');
    }
  }

  formatResponse(contactInfo) {
    return {
      id: contactInfo.id,
      heroTitle: contactInfo.heroTitle,
      heroDescription: contactInfo.heroDescription,
      heroImage: contactInfo.heroImage,
      address: contactInfo.address,
      email: contactInfo.email,
      phone: contactInfo.phone,
      socialMedia: contactInfo.socialMedia,
      latitude: contactInfo.latitude,
      longitude: contactInfo.longitude,
      isActive: contactInfo.isActive,
      createdAt: contactInfo.createdAt,
      updatedAt: contactInfo.updatedAt,
    };
  }
}

module.exports = new ContactInfoService();
