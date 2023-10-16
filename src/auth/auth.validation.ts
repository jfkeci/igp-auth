import Joi from 'joi';

export const registerValidationSchema = Joi.object({
  username: Joi.string().max(30).max(125),
  email: Joi.string().email().required().min(3).max(255),
  password: Joi.string().min(6).max(255).required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
});

/** Error messages are vague for a reason */
export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required().min(3).max(255).messages({
    'string.email': 'Invalid email',
    'any.required': 'Email Required',
    'min.max': 'Invalid email'
  }),
  password: Joi.string().min(6).max(255).required().messages({
    string: 'Invalid password',
    'any.required': 'Password Required',
    'min.max': 'Invalid password'
  })
});

export const verifyEmailParamsValidationSchema = Joi.object({
  userId: Joi.string().required().messages({
    required: 'User id param required',
    string: 'Invalid user id'
  }),
  token: Joi.string().required().messages({
    required: 'Email verification token required',
    string: 'Invalid email verification token'
  })
});
