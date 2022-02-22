import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

export const selectDomain = (state: RootState) => state.homePage || initialState;

export const selectUserPosition = createSelector([selectDomain], homePageState => homePageState.userPlatformsState);

export const selectLoading = createSelector([selectDomain], homePageState => homePageState.loading);

export const selectError = createSelector([selectDomain], homePageState => homePageState.error);
