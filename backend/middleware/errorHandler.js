const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error(err.stack);
  
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors,
      });
    }
  
    // Handle Mongoose duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Duplicate field value: ${field}. Please use another value.`,
      });
    }
  
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
      });
    }
  
    // Handle JWT expired error
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.',
      });
    }
  
    // Handle cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: `Invalid ${err.path}: ${err.value}`,
      });
    }
  
    // Handle file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size is too large. Please upload a file less than 2MB.',
      });
    }
  
    // Handle unauthorized errors
    if (err.status === 401) {
      return res.status(401).json({
        success: false,
        message: err.message || 'Unauthorized access',
      });
    }
  
    // Handle forbidden errors
    if (err.status === 403) {
      return res.status(403).json({
        success: false,
        message: err.message || 'Forbidden access',
      });
    }
  
    // Handle not found errors
    if (err.status === 404) {
      return res.status(404).json({
        success: false,
        message: err.message || 'Resource not found',
      });
    }
  
    // Default to 500 server error
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.stack,
      }),
    });
  };
  
  export default errorHandler;
  