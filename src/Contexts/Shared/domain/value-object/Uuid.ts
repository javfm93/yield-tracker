import { v4 } from 'uuid';
import validate from 'uuid-validate';
import { InvalidArgumentError } from './InvalidArgumentError';

export class Uuid {
  readonly value: string;

  constructor(value: string) {
    if (!validate(value)) {
      throw new InvalidArgumentError(`<${this.constructor.name}> does not allow the value <${value}>`);
    }
    this.value = value;
  }

  static random(): Uuid {
    return new Uuid(v4());
  }

  isEqualTo(uuid: Uuid) {
    return this.value === uuid.value;
  }

  toString(): string {
    return this.value;
  }
}
