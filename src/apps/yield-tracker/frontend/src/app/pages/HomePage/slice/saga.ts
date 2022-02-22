import { call, put, takeLatest } from 'redux-saga/effects';
import { homePageActions } from '.';
import { schema } from 'normalizr';
import { CallReturns, GlobalState, SmartContractHistory, UserPlatformsState, UserSmartContractState } from './types';
import {
  AvailableSmartContractsAddress,
  getUserSmartContracts,
} from '../../../../modules/smartContract/application/get-user-smart-contracts';
import { BigNumberish, ethers } from 'ethers';
import { SmartContract } from '../../../../modules/smartContract/domain/smart-contract';

const jobEntity = new schema.Entity('job');
const employeeEntity = new schema.Entity('employee');
const commentEntity = new schema.Entity('comment', {
  job: jobEntity,
});

employeeEntity.define({
  job: jobEntity,
  boss: employeeEntity,
  comments: [commentEntity],
});

// todo: if we have multiple transactions in a day, only keep the balance of the last one
// todo: normalize
// todo prices probably will go to store
export function* getContractsDetails(): Generator<any, void, any> {
  try {
    const usersSmartContract: CallReturns<typeof getUserSmartContracts> = yield call(getUserSmartContracts);

    const bunnySmartContract = usersSmartContract[AvailableSmartContractsAddress.BUNNY];
    const cakeSmartContract = usersSmartContract[AvailableSmartContractsAddress.CAKE];
    const bunnyBnbFlipBoostContract = usersSmartContract[AvailableSmartContractsAddress.BUNNY_BNB_FLIP_BOOST];
    const acryptosBtcBusdContract = usersSmartContract[AvailableSmartContractsAddress.ACRYPTOS_BTC_BUSD];

    const userPlatformsStates: UserPlatformsState = {
      totalCurrentBalance: '',
      totalUnrealizedProfit: '',
      totalRealizedProfit: '',
      platforms: [
        {
          name: 'Acryptos',
          smartContractsState: [formatSmartContractToView(acryptosBtcBusdContract)],
        },
        {
          name: 'Pancake-bunny',
          smartContractsState: [
            formatSmartContractToView(bunnySmartContract),
            formatSmartContractToView(cakeSmartContract),
            formatSmartContractToView(bunnyBnbFlipBoostContract),
          ],
        },
      ],
    };

    const globalState = [
      ...userPlatformsStates.platforms[0].smartContractsState,
      ...userPlatformsStates.platforms[1].smartContractsState,
    ].reduce(
      (acc: { totalCurrentBalance: number; totalUnrealizedProfit: number; totalRealizedProfit: number }, current) => ({
        totalCurrentBalance: acc.totalCurrentBalance + parseFloat(current.balance) * parseFloat(current.price),
        totalUnrealizedProfit: acc.totalUnrealizedProfit + parseFloat(current.profit) * parseFloat(current.price),
        totalRealizedProfit:
          acc.totalUnrealizedProfit + parseFloat(current.contractHistory.withdrawnProfit) * parseFloat(current.price),
      }),
      { totalCurrentBalance: 0, totalUnrealizedProfit: 0, totalRealizedProfit: 0 },
    );

    yield put(
      homePageActions.contractDetailsLoaded(
        JSON.parse(JSON.stringify({ ...userPlatformsStates, ...formatGlobalState(globalState) })),
      ),
    );
  } catch (err) {
    console.log(err);
    console.log(`we've got an error ${err.response?.status}!! ${err.message}`);
    yield put(homePageActions.contractDetailsError(err));
  }
}

const fromBigNumberToFixed = (number: BigNumberish) => parseFloat(ethers.utils.formatUnits(number)).toFixed(2);

const fromContractHistoryToFixed = (history: SmartContractHistory): SmartContractHistory => ({
  ...history,
  withdrawnProfit: fromBigNumberToFixed(history.withdrawnProfit),
  withdrawnMinted: fromBigNumberToFixed(history.withdrawnMinted),
});

const formatSmartContractToView = (smartContract: SmartContract): UserSmartContractState => ({
  address: smartContract.address.toString(),
  stakedToken: smartContract.getStakedToken().getSymbol(),
  stakedTokenIcon: smartContract.getStakedToken().getIcon(),
  rewardedToken: smartContract.getRewardedToken().getSymbol(),
  rewardedTokenIcon: smartContract.getRewardedToken().getIcon(),
  mintedToken: smartContract.getMintedToken().getSymbol(),
  mintedTokenIcon: smartContract.getMintedToken().getIcon(),
  mintedTokenPrice: smartContract.getMintedToken().getPrice(),
  apr: fromBigNumberToFixed(smartContract.getApr()),
  tvl: fromBigNumberToFixed(smartContract.getTvl()),
  price: smartContract.getStakedToken().getPrice(),
  balance: fromBigNumberToFixed(smartContract.getUserBalance()),
  totalValue: (
    (parseFloat(smartContract.getStakedToken().getPrice()) ?? 0) *
    parseFloat(ethers.utils.formatUnits(smartContract.getUserBalance()))
  ).toString(),
  profit: fromBigNumberToFixed(smartContract.getUserProfit()),
  profitPrice: smartContract.getRewardedToken().getPrice(),
  profitsValue: (
    (parseFloat(smartContract.getRewardedToken().getPrice()) ?? 0) *
    parseFloat(ethers.utils.formatUnits(smartContract.getUserProfit()))
  ).toString(),
  contractHistory: fromContractHistoryToFixed(smartContract.getUserHistory()),
});

const formatGlobalState = (globalState: {
  totalCurrentBalance: number;
  totalUnrealizedProfit: number;
  totalRealizedProfit: number;
}): GlobalState => ({
  totalCurrentBalance: globalState.totalCurrentBalance.toFixed(2),
  totalUnrealizedProfit: globalState.totalUnrealizedProfit.toFixed(2),
  totalRealizedProfit: globalState.totalRealizedProfit.toFixed(2),
});

export function* githubRepoFormSaga() {
  yield takeLatest(homePageActions.loadContractDetails.type, getContractsDetails);
}
