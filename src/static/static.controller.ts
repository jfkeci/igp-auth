import { Request, Response, Router } from 'express';
import Controller from '../utils/interfaces/controller.interface';
import { StaticRoutes } from './static.rotues';
import path from 'path';

export class StaticController implements Controller {
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router = new StaticRoutes().init(this);
  }

  getConfirmEmailPage(req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  }
}
