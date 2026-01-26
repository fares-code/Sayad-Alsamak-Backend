const { prisma } = require('../config/database');

class OrderService {
  async createOrder(orderData) {
    // Check products and stock
    const productsToOrder = await Promise.all(
      orderData.items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`المنتج غير موجود`);
        }

        return {
          product,
          quantity: item.quantity,
        };
      })
    );

    // Calculate amounts
    const subtotal = productsToOrder.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    );
    const discount = orderData.discount || 0;
    const deliveryFee = orderData.deliveryFee || 0;
    const tax = orderData.tax || 0;
    const total = subtotal - discount + deliveryFee + tax;

    const orderNumber = await this.generateOrderNumber();

    // Create order in transaction
    const order = await prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          subtotal,
          discount,
          deliveryFee,
          tax,
          total,
          paymentMethod: orderData.paymentMethod,
          paymentStatus: 'PENDING',
          deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : null,
          deliveryTime: orderData.deliveryTime,
          customerNotes: orderData.customerNotes,
          status: 'PENDING',
          // Store address data directly from nested object
          customerName: orderData.address.fullName,
          customerPhone: orderData.address.phone,
          governorate: orderData.address.governorate,
          city: orderData.address.city,
          district: orderData.address.district,
          street: orderData.address.street,
          buildingNo: orderData.address.buildingNo,
          floor: orderData.address.floor,
          apartment: orderData.address.apartment,
          landmark: orderData.address.landmark,
        },
      });

      // Create order items
      await Promise.all(
        productsToOrder.map((item) =>
          prisma.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.product.id,
              productName: item.product.nameAr,
              productImage: item.product.mainImage,
              quantity: item.quantity,
              price: item.product.price,
              total: item.product.price * item.quantity,
            },
          })
        )
      );

      // Update stock and sales count
      for (const item of productsToOrder) {
        await prisma.product.update({
          where: { id: item.product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
            salesCount: {
              increment: item.quantity,
            },
          },
        });
      }

      return newOrder;
    }, {
      timeout: 30000,
    });

    return this.getOrderById(order.id);
  }

  async getAllOrders() {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(order => this.formatOrderResponse(order));
  }

  async getOrderById(orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!order) {
      throw new Error('الطلب غير موجود');
    }

    return this.formatOrderResponse(order);
  }

  async getOrderByNumber(orderNumber) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!order) {
      throw new Error('الطلب غير موجود');
    }

    return this.formatOrderResponse(order);
  }

  async getOrdersByStatus(status) {
    const orders = await prisma.order.findMany({
      where: { status },
      include: {
        items: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(order => this.formatOrderResponse(order));
  }

  async updateOrderStatus(orderId, updateData) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error('الطلب غير موجود');
    }

    const dataToUpdate = {
      status: updateData.status,
    };

    if (updateData.adminNotes) {
      dataToUpdate.adminNotes = updateData.adminNotes;
    }

    // If order is cancelled, restore stock
    if (updateData.status === 'CANCELLED') {
      dataToUpdate.cancelReason = updateData.cancelReason;
      dataToUpdate.cancelledAt = new Date();

      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
            salesCount: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    await prisma.order.update({
      where: { id: orderId },
      data: dataToUpdate,
    });

    return this.getOrderById(orderId);
  }

  async updatePaymentStatus(orderId, updateData) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('الطلب غير موجود');
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: updateData.paymentStatus,
      },
    });

    return this.getOrderById(orderId);
  }

  async generateOrderNumber() {
    const prefix = 'ORD';
    const date = new Date();
    const dateStr = 
      date.getFullYear().toString() + 
      (date.getMonth() + 1).toString().padStart(2, '0') + 
      date.getDate().toString().padStart(2, '0');
    
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const orderCount = await prisma.order.count({
      where: {
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    });

    const sequence = (orderCount + 1).toString().padStart(4, '0');
    return `${prefix}${dateStr}${sequence}`;
  }

  formatOrderResponse(order) {
    const items = order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    }));

    const address = {
      fullName: order.customerName,
      phone: order.customerPhone,
      governorate: order.governorate,
      city: order.city,
      district: order.district,
      street: order.street,
      buildingNo: order.buildingNo,
      floor: order.floor,
      apartment: order.apartment,
      landmark: order.landmark,
    };

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      items,
      subtotal: order.subtotal,
      discount: order.discount,
      deliveryFee: order.deliveryFee,
      tax: order.tax,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      deliveryDate: order.deliveryDate,
      deliveryTime: order.deliveryTime,
      customerNotes: order.customerNotes,
      adminNotes: order.adminNotes,
      cancelReason: order.cancelReason,
      cancelledAt: order.cancelledAt,
      address,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}

module.exports = new OrderService();
