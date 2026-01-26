const { prisma } = require('../config/database');
const cloudinaryService = require('./cloudinary.service');

class AboutUsService {
  async create(contentData) {
    // Check if content already exists
    const existing = await prisma.aboutUsContent.findFirst();
    if (existing) {
      throw new Error('المحتوى موجود بالفعل. استخدم التحديث بدلاً من الإنشاء');
    }

    // Upload images to Cloudinary
    const [heroImage, visionImage, missionImage, ...valueImages] = await Promise.all([
      this.uploadImageIfBase64(contentData.heroImage, 'about-us', 'hero'),
      this.uploadImageIfBase64(contentData.visionImage, 'about-us', 'vision'),
      this.uploadImageIfBase64(contentData.missionImage, 'about-us', 'mission'),
      ...contentData.values.map((value, index) =>
        this.uploadImageIfBase64(value.image, 'about-us/values', `value-${index + 1}`)
      ),
    ]);

    // Update image links in values
    const values = contentData.values.map((value, index) => ({
      title: value.title,
      image: valueImages[index] || value.image,
    }));

    // Create content
    const content = await prisma.aboutUsContent.create({
      data: {
        heroTitle: contentData.heroTitle,
        heroDescription: contentData.heroDescription,
        heroImage: heroImage || contentData.heroImage,
        visionTitle: contentData.visionTitle,
        visionDescription: contentData.visionDescription,
        visionImage: visionImage || contentData.visionImage,
        missionTitle: contentData.missionTitle,
        missionDescription: contentData.missionDescription,
        missionImage: missionImage || contentData.missionImage,
        valuesTitle: contentData.valuesTitle,
        values: values,
      },
    });

    return this.formatResponse(content);
  }

  async getActive() {
    const content = await prisma.aboutUsContent.findFirst({
      where: { isActive: true },
    });

    if (!content) {
      throw new Error('لا يوجد محتوى نشط');
    }

    return this.formatResponse(content);
  }

  async findOne(id) {
    this.validateObjectId(id);

    const content = await prisma.aboutUsContent.findUnique({
      where: { id },
    });

    if (!content) {
      throw new Error('المحتوى غير موجود');
    }

    return this.formatResponse(content);
  }

  async update(id, updateData) {
    this.validateObjectId(id);

    const existing = await prisma.aboutUsContent.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('المحتوى غير موجود');
    }

    // Upload new images only
    const uploadPromises = [];

    if (updateData.heroImage && this.isBase64Image(updateData.heroImage)) {
      uploadPromises.push(this.uploadImageIfBase64(updateData.heroImage, 'about-us', 'hero'));
    } else {
      uploadPromises.push(Promise.resolve(undefined));
    }

    if (updateData.visionImage && this.isBase64Image(updateData.visionImage)) {
      uploadPromises.push(this.uploadImageIfBase64(updateData.visionImage, 'about-us', 'vision'));
    } else {
      uploadPromises.push(Promise.resolve(undefined));
    }

    if (updateData.missionImage && this.isBase64Image(updateData.missionImage)) {
      uploadPromises.push(this.uploadImageIfBase64(updateData.missionImage, 'about-us', 'mission'));
    } else {
      uploadPromises.push(Promise.resolve(undefined));
    }

    // Upload value images if updated
    if (updateData.values) {
      updateData.values.forEach((value, index) => {
        if (this.isBase64Image(value.image)) {
          uploadPromises.push(
            this.uploadImageIfBase64(value.image, 'about-us/values', `value-${index + 1}`)
          );
        } else {
          uploadPromises.push(Promise.resolve(undefined));
        }
      });
    }

    const uploadedImages = await Promise.all(uploadPromises);

    // Update data
    const dataToUpdate = {};

    if (updateData.heroTitle) dataToUpdate.heroTitle = updateData.heroTitle;
    if (updateData.heroDescription) dataToUpdate.heroDescription = updateData.heroDescription;
    if (uploadedImages[0]) dataToUpdate.heroImage = uploadedImages[0];

    if (updateData.visionTitle) dataToUpdate.visionTitle = updateData.visionTitle;
    if (updateData.visionDescription) dataToUpdate.visionDescription = updateData.visionDescription;
    if (uploadedImages[1]) dataToUpdate.visionImage = uploadedImages[1];

    if (updateData.missionTitle) dataToUpdate.missionTitle = updateData.missionTitle;
    if (updateData.missionDescription) dataToUpdate.missionDescription = updateData.missionDescription;
    if (uploadedImages[2]) dataToUpdate.missionImage = uploadedImages[2];

    if (updateData.valuesTitle) dataToUpdate.valuesTitle = updateData.valuesTitle;

    if (updateData.values) {
      dataToUpdate.values = updateData.values.map((value, index) => ({
        title: value.title,
        image: uploadedImages[3 + index] || value.image,
      }));
    }

    const content = await prisma.aboutUsContent.update({
      where: { id },
      data: dataToUpdate,
    });

    return this.formatResponse(content);
  }

  async remove(id) {
    this.validateObjectId(id);

    const content = await prisma.aboutUsContent.findUnique({
      where: { id },
    });

    if (!content) {
      throw new Error('المحتوى غير موجود');
    }

    await prisma.aboutUsContent.delete({
      where: { id },
    });

    return { message: 'تم حذف المحتوى بنجاح' };
  }

  async toggleActive(id) {
    this.validateObjectId(id);

    const content = await prisma.aboutUsContent.findUnique({
      where: { id },
    });

    if (!content) {
      throw new Error('المحتوى غير موجود');
    }

    const updated = await prisma.aboutUsContent.update({
      where: { id },
      data: { isActive: !content.isActive },
    });

    return this.formatResponse(updated);
  }

  async uploadImageIfBase64(image, folder, publicId) {
    if (this.isBase64Image(image)) {
      try {
        return await cloudinaryService.uploadImageFromBase64(image, folder, publicId);
      } catch (error) {
        throw new Error(`فشل رفع الصورة: ${error.message}`);
      }
    }
    return undefined;
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

  formatResponse(content) {
    return {
      id: content.id,
      heroTitle: content.heroTitle,
      heroDescription: content.heroDescription,
      heroImage: content.heroImage,
      visionTitle: content.visionTitle,
      visionDescription: content.visionDescription,
      visionImage: content.visionImage,
      missionTitle: content.missionTitle,
      missionDescription: content.missionDescription,
      missionImage: content.missionImage,
      valuesTitle: content.valuesTitle,
      values: content.values,
      isActive: content.isActive,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    };
  }
}

module.exports = new AboutUsService();
