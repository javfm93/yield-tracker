import { shallowEqual } from 'shallow-equal-object';

interface ValueObjectProps {
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  public readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public isEqualTo(valueObject?: ValueObject<T>): boolean {
    if (valueObject === null || valueObject === undefined) {
      return false;
    }
    if (valueObject.props === undefined) {
      return false;
    }
    return shallowEqual(this.props, valueObject.props);
  }
}
