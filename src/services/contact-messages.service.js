const { prisma } = require('../config/database');

class ContactMessagesService {
  async create(messageData) {
    const message = await prisma.contactMessage.create({
      data: messageData,
    });

    return this.formatResponse(message);
  }

  async findAll(filters = {}) {
    const where = {};

    if (filters.isRead !== undefined) {
      where.isRead = filters.isRead;
    }

    if (filters.isReplied !== undefined) {
      where.isReplied = filters.isReplied;
    }

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return messages.map((msg) => this.formatResponse(msg));
  }

  async findOne(id) {
    this.validateObjectId(id);

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new Error('الرسالة غير موجودة');
    }

    return this.formatResponse(message);
  }

  async update(id, updateData) {
    this.validateObjectId(id);

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new Error('الرسالة غير موجودة');
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: updateData,
    });

    return this.formatResponse(updated);
  }

  async markAsRead(id) {
    return this.update(id, { isRead: true });
  }

  async markAsReplied(id) {
    return this.update(id, { isReplied: true });
  }

  async remove(id) {
    this.validateObjectId(id);

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new Error('الرسالة غير موجودة');
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    return { message: 'تم حذف الرسالة بنجاح' };
  }

  async getStats() {
    const [total, unread, read, replied] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.contactMessage.count({ where: { isRead: true } }),
      prisma.contactMessage.count({ where: { isReplied: true } }),
    ]);

    return {
      total,
      unread,
      read,
      replied,
    };
  }

  validateObjectId(id) {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(id)) {
      throw new Error('معرف غير صالح');
    }
  }

  formatResponse(message) {
    return {
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone,
      message: message.message,
      isRead: message.isRead,
      isReplied: message.isReplied,
      notes: message.notes,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}

module.exports = new ContactMessagesService();
