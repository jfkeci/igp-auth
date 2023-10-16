export const rateLimiterConfig = () => ({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: 'Too many requests, please try again later'
});
