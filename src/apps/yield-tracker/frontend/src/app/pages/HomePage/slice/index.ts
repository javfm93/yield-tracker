import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { githubRepoFormSaga } from './saga';
import { HomePageState, UserPlatformsState } from './types';

export const initialState: HomePageState = {
  userPlatformsState: undefined,
  loading: false,
  error: undefined,
};

const slice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    loadContractDetails(state) {
      state.userPlatformsState = undefined;
      state.loading = true;
      state.error = undefined;
    },
    contractDetailsLoaded(state, action: PayloadAction<UserPlatformsState>) {
      state.userPlatformsState = action.payload;
      state.loading = false;
      state.error = undefined;
    },
    contractDetailsError(state, action: PayloadAction<any>) {
      state.userPlatformsState = undefined;
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { actions: homePageActions, reducer } = slice;

export const useHomePageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: githubRepoFormSaga });
  return { actions: slice.actions };
};
