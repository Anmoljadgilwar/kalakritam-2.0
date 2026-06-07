export const catchAsync = (fn) => {
  return async (c, next) => {
    try {
      return await fn(c, next);
    } catch (error) {
      console.error("Async error caught:", error);
      return c.json({
        success: false,
        message: "Internal server error",
        error: error.message
      }, 500);
    }
  };
};
