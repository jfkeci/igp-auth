import Joi from 'joi';

export const registerValidationSchema = Joi.object({
  username: Joi.string().max(30).max(125),
  email: Joi.string().email().required().min(3).max(255),
  password: Joi.string().min(6).max(255).required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required().min(3).max(255),
  password: Joi.string().min(6).max(255).required(),
});
