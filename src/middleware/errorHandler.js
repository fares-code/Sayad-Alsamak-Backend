const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error
  let error = {
    message: err.message || 'Something went wrong',
    status: err.status || 500,
  };

  // Prisma errors
  if (err.code === 'P2002') {
    error = {
      message: 'A record with this value already exists',
      status: 400,
    };
  }

  if (err.code === 'P2025') {
    error = {
      message: 'Record not found',
      status: 404,
    };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error = {
      message: 'Validation failed',
      status: 400,
      details: err.details,
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      status: 401,
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      status: 401,
    };
  }

  res.status(error.status).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(error.details && { details: error.details }),
  });
};

module.exports = errorHandler;
