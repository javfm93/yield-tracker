import { Controller } from '../../../backoffice/backend/controllers/Controller';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { CommandBus } from '../../../../Contexts/Shared/domain/CommandBus';
import { CreateUserCommand } from '../../../../Contexts/Yield-Tracker/Users/application/Create/CreateUserCommand';

// todo: error handling
export class UserPutController implements Controller {
  constructor(private commandBus: CommandBus) {}
  async run(req: Request, res: Response) {
    const id: string = req.params.id;
    const address: string = req.body.address;

    const createUserCommand = new CreateUserCommand({ id, address });
    await this.commandBus.dispatch(createUserCommand);
    res.status(httpStatus.CREATED).send();
  }
}
