# Sayad Alsamak Backend - Express Version

This is the Express.js version of the Sayad Alsamak backend API, converted from NestJS to provide a more lightweight and flexible solution.

## 🚀 Features

- **Express.js Framework**: Lightweight and fast web framework
- **MongoDB with Prisma**: Modern database ORM for type-safe database access
- **JWT Authentication**: Secure token-based authentication
- **File Upload**: Cloudinary integration for image uploads
- **Validation**: Joi-based request validation
- **Error Handling**: Centralized error handling middleware
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Morgan for HTTP request logging

## 📁 Project Structure

```
express/
├── src/
│   ├── app.js                 # Main application file
│   ├── config/
│   │   ├── database.js        # Prisma database configuration
│   │   └── environment.js     # Environment variables configuration
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication middleware
│   │   ├── validation.js     # Request validation middleware
│   │   └── errorHandler.js   # Error handling middleware
│   ├── routes/
│   │   ├── auth/             # Authentication routes
│   │   ├── category/         # Category management routes
│   │   ├── product/          # Product management routes
│   │   ├── order/            # Order management routes
│   │   ├── contact-messages/ # Contact messages routes
│   │   ├── contact-info/     # Contact information routes
│   │   ├── about-us/         # About us page routes
│   │   └── homepage/         # Homepage content routes
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── category.service.js
│   │   ├── product.service.js
│   │   ├── order.service.js
│   │   ├── contact-messages.service.js
│   │   ├── contact-info.service.js
│   │   ├── about-us.service.js
│   │   ├── homepage.service.js
│   │   └── cloudinary.service.js
│   └── utils/
├── prisma/
│   └── schema.prisma         # Database schema
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🛠️ Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy the `.env` file from the original NestJS project or create a new one with the following variables:
   ```env
   DATABASE_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   NODE_ENV=development
   ```

3. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

4. **Run database migrations** (if needed):
   ```bash
   npx prisma db push
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 5000 (or the port specified in your `.env` file).

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints
- `POST /auth/register` - Register new admin
- `POST /auth/login` - Login admin
- `GET /auth/profile` - Get user profile (protected)
- `GET /auth/me` - Get current user (protected)

### Category Endpoints
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create category (admin)
- `PUT /categories/:id` - Update category (admin)
- `DELETE /categories/:id` - Delete category (admin)
- `PATCH /categories/:id/toggle-active` - Toggle category active status (admin)

### Product Endpoints
- `GET /products` - Get all products with filters
- `GET /products/:id` - Get product by ID
- `GET /products/slug/:slug` - Get product by slug
- `GET /products/related/:id` - Get related products
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)
- `PATCH /products/:id/stock` - Update product stock (admin)

### Order Endpoints
- `POST /orders` - Create new order
- `GET /orders` - Get all orders (admin)
- `GET /orders/:id` - Get order by ID (admin)
- `GET /orders/number/:orderNumber` - Get order by number
- `PATCH /orders/:id/status` - Update order status (admin)
- `PATCH /orders/:id/payment-status` - Update payment status (admin)

### Homepage Endpoints
- `GET /homepage/data` - Get all homepage data
- `GET /homepage/content` - Get homepage content
- `GET /homepage/featured` - Get featured products
- `GET /homepage/best-sellers` - Get best seller products
- `GET /homepage/new-arrivals` - Get new arrival products
- `GET /homepage/categories` - Get active categories

### Contact Endpoints
- `POST /contact-messages` - Send contact message
- `GET /contact-messages` - Get all messages (admin)
- `GET /contact-info/active` - Get active contact info

## 🔒 Authentication

Protected endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

Admin-only endpoints require both authentication and admin role.

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schema validation
- **JWT Authentication**: Secure token-based auth
- **Error Handling**: Centralized error handling

## 📝 Validation

All requests are validated using Joi schemas. Validation errors return detailed messages about what fields are invalid.

## 🔄 Migration from NestJS

This Express version maintains the same API endpoints and functionality as the original NestJS version while providing:

- Better performance
- Smaller bundle size
- More flexibility
- Easier debugging
- Simpler architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

UNLICENSED
# Sayad-Alsamak-Backend
