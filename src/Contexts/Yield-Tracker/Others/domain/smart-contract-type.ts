import { ValueObject } from '../../../Shared/domain/ValueObject';

export enum SmartContractTypes {
  FARM_DIFFERENT_TOKEN,
  FARM_DIFFERENT_TOKEN_AND_MINT,
  AUTO_COMPOUND_SAME_TOKEN,
  AUTO_COMPOUND_SAME_TOKEN_AND_MINT
}

interface SmartContractTypeProps {
  value: SmartContractTypes;
}

export class SmartContractType extends ValueObject<SmartContractTypeProps> {
  private constructor(props: SmartContractTypeProps) {
    super(props);
  }

  public static create(type: SmartContractTypes) {
    if (!(type in SmartContractTypes)) {
      throw Error('Not a valid smart-contract type');
    }

    return new SmartContractType({ value: type });
  }

  public isAutoCompoundingStake(): boolean {
    return this.props.value === SmartContractTypes.AUTO_COMPOUND_SAME_TOKEN;
  }
  public isAutoCompoundingStakeAndMinting(): boolean {
    return this.props.value === SmartContractTypes.AUTO_COMPOUND_SAME_TOKEN_AND_MINT;
  }

  public isFarmingDifferentToken(): boolean {
    return this.props.value === SmartContractTypes.FARM_DIFFERENT_TOKEN;
  }

  public isFarmingDifferentTokenAndMinting(): boolean {
    return this.props.value === SmartContractTypes.FARM_DIFFERENT_TOKEN_AND_MINT;
  }

  public isMinting(): boolean {
    return this.isFarmingDifferentTokenAndMinting() || this.isAutoCompoundingStakeAndMinting();
  }
}
