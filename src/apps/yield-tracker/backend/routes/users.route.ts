import { Router } from 'express';
import container from '../dependency-injection';
import { UserGetController } from '../controllers/UserGetController';
import { UserPutController } from '../controllers/UserPutController';

export const register = (router: Router) => {
  const userGetController: UserGetController = container.get('Apps.YieldTracker.Backend.controllers.UserGetController');
  router.get('/users/address/:userAddress', userGetController.run.bind(userGetController));

  const userPutController: UserPutController = container.get('Apps.YieldTracker.Backend.controllers.UserPutController');
  router.put('/users/:id', userPutController.run.bind(userPutController));
};
