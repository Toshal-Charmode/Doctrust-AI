export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error.errors) {
        const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        return res.status(400).json({
          success: false,
          message: errorMessages,
          error: error.errors,
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        error: error.message,
      });
    }
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error.errors) {
        const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        return res.status(400).json({
          success: false,
          message: errorMessages,
          error: error.errors,
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        error: error.message,
      });
    }
  };
}

export default {
  validateBody,
  validateQuery,
};
