import { BlockchainGateway } from '../domain/blockchain-gateway';
import { JsonRpcProvider } from '@ethersproject/providers/src.ts/json-rpc-provider';
import { ethers } from 'ethers';
import { User } from '../domain/User';
import { AvailableTokens, Token } from '../domain/token';
import { AvailablePlatforms, SmartContract } from '../domain/smart-contract';
import { SmartContractType, SmartContractTypes } from '../domain/smart-contract-type';
import { Address } from '../../../Shared/domain/Address';
// @ts-ignore
import Moralis from 'moralis';
import {
  AcryptosBtcBusd__factory,
  Bunny__factory,
  BunnyBnbFlipBoost__factory,
  Cake__factory
} from '../../../../apps/yield-tracker/frontend/src/types/smart-contracts';

export enum AvailableSmartContractsAddress {
  BUNNY = '0xcadc8cb26c8c7cb46500e61171b5f27e9bd7889d',
  CAKE = '0xedfcb78e73f7ba6ad2d829bf5d462a0924da28ed',
  BUNNY_BNB_FLIP_BOOST = '0x69ff781cf86d42af9bf93c06b8be0f16a2905cbc',
  ACRYPTOS_BTC_BUSD = '0xbe627707f079e32a54d323be0c61da02a28bd0bd'
}

enum tokensAddress {
  BUNNY = '0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51',
  CAKE = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  BUNNY_BNB = '0xFAKEdB9CBd36B01bD1cBaEBF2De08d9173bcFAKE',
  ACS = '0x4197c6ef3879a08cd51e5560da5064b773aa1d29',
  BTCB_BUSD = '0xbe627707f079e32a54d323be0c61da02a28bd0bd'
}

export class EthersBlockchainGateway implements BlockchainGateway {
  private provider: JsonRpcProvider;

  private contractPerAddress: Record<
    AvailableSmartContractsAddress,
    (user: User) => Promise<SmartContract>
  > = {
    [AvailableSmartContractsAddress.BUNNY]: (user: User) => this.getBunnyContractFor(user),
    [AvailableSmartContractsAddress.CAKE]: (user: User) => this.getCakeContractFor(user),
    [AvailableSmartContractsAddress.BUNNY_BNB_FLIP_BOOST]: (user: User) =>
      this.getBunnyBnbFlipBoostContractFor(user),
    [AvailableSmartContractsAddress.ACRYPTOS_BTC_BUSD]: (user: User) =>
      this.getAcryptosBtcBusdContractFor(user)
  };

  constructor() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
  }

  async connectToWallet(): Promise<string> {
    Moralis.initialize('hfkyca1Ua14bqmaOHCiwnCC2aQBN6wnijfplP3h2');
    Moralis.serverURL = 'https://bz3cwul5zynq.moralis.io:2053/server';
    const user = await Moralis.User.current();
    if (!user) {
      await Moralis.Web3.authenticate();
      user.save();
    }
    return Moralis.User.current().attributes.ethAddress;
  }

  getSmartContractInformationForUser(
    address: AvailableSmartContractsAddress,
    user: User
  ): Promise<SmartContract> {
    return this.contractPerAddress[address](user);
  }

  private async getBunnyContractFor(user: User): Promise<SmartContract> {
    const stakedToken = AvailableTokens.BUNNY;
    const rewardedToken = AvailableTokens.WBNB;
    const smartContract = Bunny__factory.connect(
      AvailableSmartContractsAddress.BUNNY,
      this.provider
    );
    const apy = await smartContract.apy();
    const tvl = await smartContract.tvl();
    const userBalance = await smartContract.balanceOf(user.address.toString());
    const userProfit = await smartContract.profitOf(user.address.toString());
    const smartContractType = SmartContractType.create(SmartContractTypes.FARM_DIFFERENT_TOKEN);

    return SmartContract.create(AvailableSmartContractsAddress.BUNNY, {
      platform: AvailablePlatforms.BUNNY,
      apr: apy._bnb.toString(),
      tvl: tvl.toString(),
      rewardedToken: Token.create(tokensAddress.WBNB, { symbol: rewardedToken }),
      stakedToken: Token.create(tokensAddress.BUNNY, { symbol: stakedToken }),
      type: smartContractType,
      userBalance: userBalance.toString(),
      userProfit: userProfit._bnb.toString()
    });
  }

  // todo: i should create a valid address value object which checks if it is valid address
  private async getBunnyBnbFlipBoostContractFor(user: User): Promise<SmartContract> {
    const stakedToken = AvailableTokens.CAKE_LP;
    const rewardedToken = AvailableTokens.CAKE;
    const mintedToken = AvailableTokens.BUNNY;
    const smartContract = BunnyBnbFlipBoost__factory.connect(
      AvailableSmartContractsAddress.BUNNY_BNB_FLIP_BOOST,
      this.provider
    );
    const apy = '0';
    const tvl = '0';
    const userBalance = await smartContract.balanceOf(user.address.toString());
    const userProfit = await smartContract.earned(user.address.toString());
    const smartContractType = SmartContractType.create(
      SmartContractTypes.FARM_DIFFERENT_TOKEN_AND_MINT
    );
    const minterAddress = Address.create(await smartContract.minter());
    return SmartContract.create(AvailableSmartContractsAddress.BUNNY_BNB_FLIP_BOOST, {
      platform: AvailablePlatforms.BUNNY,
      apr: apy,
      tvl: tvl,
      rewardedToken: Token.create(tokensAddress.CAKE, { symbol: rewardedToken }),
      stakedToken: Token.create(tokensAddress.BUNNY_BNB, { symbol: stakedToken }),
      mintedToken: Token.create(tokensAddress.BUNNY, { symbol: mintedToken }),
      type: smartContractType,
      userBalance: userBalance.toString(),
      userProfit: userProfit.toString(),
      minterAddress
    });
  }

  private async getCakeContractFor(user: User): Promise<SmartContract> {
    const stakedToken = AvailableTokens.CAKE;
    const rewardedToken = AvailableTokens.CAKE;
    const mintedToken = AvailableTokens.BUNNY;
    const smartContract = Cake__factory.connect(AvailableSmartContractsAddress.CAKE, this.provider);
    const apy = '0';
    const tvl = '0';
    const userBalance = await smartContract.balanceOf(user.address.toString());
    const userProfit = await smartContract.earned(user.address.toString());
    const smartContractType = SmartContractType.create(
      SmartContractTypes.AUTO_COMPOUND_SAME_TOKEN_AND_MINT
    );
    const minterAddress = Address.create(await smartContract.minter());
    console.log(minterAddress);
    return SmartContract.create(AvailableSmartContractsAddress.CAKE, {
      platform: AvailablePlatforms.BUNNY,
      apr: apy,
      tvl: tvl,
      rewardedToken: Token.create(tokensAddress.CAKE, { symbol: rewardedToken }),
      stakedToken: Token.create(tokensAddress.CAKE, { symbol: stakedToken }),
      mintedToken: Token.create(tokensAddress.BUNNY, { symbol: mintedToken }),
      type: smartContractType,
      userBalance: userBalance.toString(),
      userProfit: userProfit.toString(),
      minterAddress
    });
  }

  private async getAcryptosBtcBusdContractFor(user: User): Promise<SmartContract> {
    const lpAddress = tokensAddress.BTCB_BUSD;
    const stakedToken = AvailableTokens.CAKE_LP;
    const rewardedToken = AvailableTokens.CAKE_LP;
    const mintedToken = AvailableTokens.ACS;
    const minter = '0xb1fa5d3c0111d8e9ac43a19ef17b281d5d4b474e';
    const smartContract = AcryptosBtcBusd__factory.connect(minter, this.provider);
    const apy = '0';
    const tvl = '0';
    const userBalance = await smartContract.calculateWeight(lpAddress, user.address.toString());
    const userProfit = await smartContract.pendingSushi(lpAddress, user.address.toString());
    const smartContractType = SmartContractType.create(
      SmartContractTypes.AUTO_COMPOUND_SAME_TOKEN_AND_MINT
    );
    const minterAddress = Address.create(minter);
    return SmartContract.create(AvailableSmartContractsAddress.ACRYPTOS_BTC_BUSD, {
      platform: AvailablePlatforms.ACRYPTOS,
      apr: apy,
      tvl: tvl,
      rewardedToken: Token.create(lpAddress, { symbol: rewardedToken }),
      stakedToken: Token.create(lpAddress, { symbol: stakedToken }),
      mintedToken: Token.create(tokensAddress.ACS, { symbol: mintedToken }),
      type: smartContractType,
      userBalance: userBalance.toString(),
      userProfit: userProfit.toString(),
      minterAddress: minterAddress
    });
  }
}
