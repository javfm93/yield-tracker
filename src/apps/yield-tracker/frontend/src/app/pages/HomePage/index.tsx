import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import Title from '../../components/Title';
import useContracts from './use-contracts';
import { UserPlatformsState, UserSmartContractState } from './slice/types';
import { FunctionComponent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { SmartContractCard } from './components/SmartContractCard';
import { GlobalStats } from './components/GlobalStats';

export const HomePage: FunctionComponent = () => {
  const { isLoading, userPosition, error } = useContracts();
  const Loader = () => <Title> Im loading, wait... PLEASE!!</Title>;
  const RenderPage = ({ userPosition }: { userPosition: UserPlatformsState }) => (
    <>
      <GlobalStats userPosition={userPosition} />
      {userPosition.platforms.map(platforms => (
        <PlatformSection key={platforms.name}>
          <Title> {platforms.name} </Title>
          <SmartContractsStateCards>
            {platforms.smartContractsState.map(smartContract => (
              <Link
                to={`/platform/${platforms.name}/smart-contract/${smartContract.address}`}
                key={smartContract.address}
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <SmartContractCard smartContract={smartContract} />
              </Link>
            ))}
          </SmartContractsStateCards>
        </PlatformSection>
      ))}
    </>
  );
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      {isLoading || !userPosition ? <Loader /> : <RenderPage userPosition={userPosition} />}
    </>
  );
};

export const PlatformSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SmartContractsStateCards = styled.div`
  display: grid;
  gap: 1rem;
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
`;
