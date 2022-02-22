import { Controller } from '../../../backoffice/backend/controllers/Controller';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { QueryBus } from '../../../../Contexts/Shared/domain/QueryBus';

export class UserGetController implements Controller {
  constructor(private queryBus: QueryBus) {}
  async run(req: Request, res: Response) {
    const { userAddress } = req.params;
    const user = this.queryBus.ask(userAddress);
    res.status(httpStatus.OK).json(user);
  }
}
