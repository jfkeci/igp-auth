import { Router } from 'express';
import Controller from '../utils/interfaces/controller.interface';
import { AuthRoutes } from './auth.routes';

export class AuthController implements Controller {
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router = new AuthRoutes().init(this);
  }
}
