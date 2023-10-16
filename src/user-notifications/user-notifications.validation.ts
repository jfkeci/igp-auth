import Joi from 'joi';

export const createUserNotificationValidationSchema = Joi.object({
  title: Joi.string().max(3).max(150).required(),
  body: Joi.string().optional().min(3).max(250)
});

export const createNotificationValidationSchema = Joi.object({
  title: Joi.string().max(3).max(150).required(),
  body: Joi.string().optional().min(3).max(250),
  userId: Joi.string().required()
});
