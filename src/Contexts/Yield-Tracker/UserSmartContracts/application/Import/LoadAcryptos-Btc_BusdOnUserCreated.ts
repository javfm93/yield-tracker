import { DomainEventClass } from '../../../../Shared/domain/DomainEvent';
import { DomainEventSubscriber } from '../../../../Shared/domain/DomainEventSubscriber';
import { UserCreatedDomainEvent } from '../../../Users/domain/UserCreatedDomainEvent';
import { LoadAcryptosBtcBusd } from './LoadAcryptos-Btc_Busd';
import { Address } from '../../../../Shared/domain/Address';

export class LoadAcryptosBtcBusdOnUserCreated
  implements DomainEventSubscriber<UserCreatedDomainEvent>
{
  constructor(private loadAcryptosBtcBusd: LoadAcryptosBtcBusd) {}

  subscribedTo(): DomainEventClass[] {
    return [UserCreatedDomainEvent];
  }

  async on(domainEvent: UserCreatedDomainEvent) {
    const address = new Address(domainEvent.address);
    await this.loadAcryptosBtcBusd.execute({ address });
  }
}
