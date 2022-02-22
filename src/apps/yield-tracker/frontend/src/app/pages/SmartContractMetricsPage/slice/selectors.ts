import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '../../HomePage/slice';
import { UserSmartContractsPlatform } from '../../HomePage/slice/types';

const selectDomain = (state: RootState) => state.homePage || initialState;

export const selectSmartContractMetricsOf = (platformName: UserSmartContractsPlatform['name'], address: string) =>
  createSelector([selectDomain], homePageState =>
    homePageState.userPlatformsState?.platforms
      .find(platform => platform.name === platformName)
      ?.smartContractsState.find(userPosition => userPosition.address.toString() === address),
  );

export const selectLoading = createSelector([selectDomain], homePageState => homePageState.loading);

export const selectError = createSelector([selectDomain], homePageState => homePageState.error);
