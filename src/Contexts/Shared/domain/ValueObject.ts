export abstract class ValueObject<T> {
  public abstract isEqualTo(valueObject?: ValueObject<T>): boolean;
  public abstract toString(): string;
}
