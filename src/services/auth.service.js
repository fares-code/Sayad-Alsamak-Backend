const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const config = require('../config/environment');

class AuthService {
  async register(registerData) {
    const { email, name, phone, password } = registerData;

    // Check if admin already exists
    const adminExists = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (adminExists) {
      throw new Error('لا يمكن إنشاء أكثر من مدير واحد للنظام');
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        role: 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email);

    return {
      message: 'تم إنشاء مدير النظام بنجاح',
      user,
      token,
    };
  }

  async login(loginData) {
    const { email, password } = loginData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new Error('الحساب غير نشط، يرجى التواصل مع الإدارة');
    }

    // Generate token
    const token = this.generateToken(user.id, user.email);

    return {
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
      },
      token,
    };
  }

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    return user;
  }

  async getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    return {
      message: 'تم جلب بيانات المستخدم بنجاح',
      user,
    };
  }

  generateToken(userId, email) {
    const payload = { sub: userId, email };
    return {
      access_token: jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
      }),
    };
  }
}

module.exports = new AuthService();
