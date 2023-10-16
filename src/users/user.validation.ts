import Joi from 'joi';

export const userIdParamValidationSchema = Joi.object({
  userId: Joi.string().required()
});
