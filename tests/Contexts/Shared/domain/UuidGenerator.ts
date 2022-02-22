import { Uuid } from '../../../../src/Contexts/Shared/domain/value-object/Uuid';
import * as faker from 'faker';

export class UuidGenerator {
  static random(): Uuid {
    return new Uuid(faker.datatype.uuid());
  }
}
