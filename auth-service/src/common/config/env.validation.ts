import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV   : Joi.string().valid('dev', 'prod', 'test').default('dev'),
  PORT       : Joi.number().default(3000),

  JWT_SECRET : Joi.string().required(),

  SMTP_HOST  : Joi.string().required(),
  SMTP_PORT  : Joi.number().default(587),
  SMTP_USER  : Joi.string().required(),
  SMTP_PASS  : Joi.string().required(),

  FRONTEND_URL: Joi.string().uri().required(),
}).unknown(true); // consente altre var non dichiarate