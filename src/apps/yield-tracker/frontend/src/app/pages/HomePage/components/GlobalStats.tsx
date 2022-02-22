import { UserPlatformsState } from '../slice/types';
import * as React from 'react';

export const GlobalStats = ({ userPosition }: { userPosition: UserPlatformsState }) => {
  return (
    <p>
      <span>Current balance: {userPosition.totalCurrentBalance}</span>
      <span>Unrealized profit: {userPosition.totalUnrealizedProfit}</span>
      <span>Realized profit : {userPosition.totalRealizedProfit}</span>
    </p>
  );
};
