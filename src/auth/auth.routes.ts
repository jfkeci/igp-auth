import {
  loginValidationSchema,
  registerValidationSchema,
  verifyEmailParamsValidationSchema
} from './auth.validation';
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { ValidationMiddleware } from '../utils/middlewares/validation.middleware';
import { logger } from '../utils/logger';
import { ConfigService } from '../utils/config/env.config';

export class AuthRoutes {
  private router = Router();
  private path = '/auth';

  private config = new ConfigService();

  public init(controller: AuthController): Router {
    const apiPrefix = this.config.get<string>('prefix');

    // [ ] Login any user
    logger.info(
      `${controller.constructor.name} POST ${apiPrefix}${this.path}/login route`
    );
    this.router.post(
      `${this.path}/login`,
      [ValidationMiddleware(loginValidationSchema)],
      controller.loginUser.bind(controller)
    );

    // [ ] Register user
    logger.info(
      `${controller.constructor.name} POST ${apiPrefix}${this.path}/register route`
    );
    this.router.post(
      `${this.path}/register`,
      [ValidationMiddleware(registerValidationSchema)],
      controller.registerUser.bind(controller)
    );

    // [ ] Verify user email
    logger.info(
      `${controller.constructor.name} GET ${apiPrefix}${this.path}/emails/verify route`
    );
    this.router.get(
      `${this.path}/emails/verify`,
      [ValidationMiddleware(verifyEmailParamsValidationSchema, 'query')],
      controller.verifyUserEmail.bind(controller)
    );

    return this.router;
  }
}

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints for user authentication
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: john.doe@mail.com
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: password
 *     responses:
 *       200:
 *         description: User authenticated successfully.
 *       401:
 *         description: Invalid email or password.
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username.
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: john.doe@mail.com
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: password
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm password.
 *                 example: password
 *     responses:
 *       204:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request, registration failed.
 */

/**
 * @swagger
 * /api/auth/emails/verify:
 *   get:
 *     summary: Verify user email
 *     tags: [Authentication]
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: User ID for verification.
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 62124b4fbed6940f1b55d992
 *       - name: token
 *         in: query
 *         description: Verification token.
 *         required: true
 *         schema:
 *           type: string
 *           example: token123
 *     responses:
 *       303:
 *         description: Email verified successfully.
 *       404:
 *         description: User not found.
 *       409:
 *         description: Email already verified or invalid verification code.
 */
