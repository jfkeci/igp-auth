import { Router } from 'express';
import { AuthController } from './auth.controller';

export class AuthRoutes {
  private router = Router();
  private path = '/auth';

  public init(controller: AuthController): Router {
    // [ ] Login any user
    /* this.router.post(
      `${this.path}/login`,
      [ValidationMiddleware(validate.login)],
      controller.login,
    ); */

    // [ ] Verify user

    // [ ] Set passwordResetCode and send email for password reset

    // [ ] Reset user password

    return this.router;
  }
}
