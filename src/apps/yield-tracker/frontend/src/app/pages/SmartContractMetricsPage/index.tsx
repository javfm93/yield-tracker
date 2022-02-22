import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import Title from '../../components/Title';
import useSmartContract from './use-smart-contract';
import { BigNumber, ethers } from 'ethers';
import { LineChart } from '../../components/LineChart';
import { formatUnits } from 'ethers/lib/utils';
import Row from '../../components/Row';
import Column from '../../components/Column';
import { FunctionComponent } from 'react';
import { AccumulatedTypes, Transaction } from '../../../modules/smartContract/domain/transaction';
import { Link } from 'react-router-dom';
import { UserSmartContractState, SmartContractHistory } from '../HomePage/slice/types';

// todo: decouple view from format
const formatFromTimeStampToChartDate = timeStamp => new Date(timeStamp * 1000).toLocaleDateString();

const formatFromWeiTo2Decimals = (wei: string) => parseFloat(formatUnits(wei)).toFixed(2);

export const SmartContractMetricsPage: FunctionComponent = () => {
  const { isLoading, userPosition, error } = useSmartContract();

  const SmartContractCurrentData = ({ position }: { position: UserSmartContractState }) => (
    <Row>
      <Column>
        <p>price: {position.price}</p>
        <p>balance: {position.balance}</p>
        <p>total value: {position.totalValue}</p>
      </Column>
      <Column>
        <p>apr: {position?.apr}</p>
        <p>tvl: {position?.tvl}</p>
        <p>profit: {position.profit}</p>
      </Column>
      <Column>
        <p>profit price: {position.profitPrice}</p>
        <p>profits value {position.profitsValue}</p>
        <p>
          total historical profit {position?.contractHistory?.withdrawnProfit?.toString()} {position.rewardedToken}
        </p>
      </Column>
    </Row>
  );

  const Loader = () => <Title> Im loading, wait... PLEASE!!</Title>;

  const PortfolioSection = ({ position }: { position: UserSmartContractState }) => (
    <SmartContractCurrentData position={position} />
  );

  const TokenInContractCharts = ({ contractHistory }: { contractHistory: SmartContractHistory }) => {
    const tokenTransactions = contractHistory.transactions.filter(
      tx => tx.props.token.props.symbol === userPosition?.stakedToken,
    );

    return tokenTransactions.length ? (
      <>
        <NumberOfTokensAtDateChart
          tokenTransactions={tokenTransactions}
          accumulatedType={AccumulatedTypes.stakedToken}
        />
        <ValueOfTokensAtDateChart
          tokenContractTransactions={tokenTransactions}
          accumulatedType={AccumulatedTypes.stakedToken}
        />
      </>
    ) : null;
  };

  const TokenRewardsInContractCharts = ({ contractHistory }: { contractHistory: SmartContractHistory }) => {
    const tokenTransactions = contractHistory.transactions.filter(
      tx => tx.props.token.props.symbol === userPosition?.rewardedToken,
    );

    return tokenTransactions.length ? (
      <>
        <NumberOfTokensAtDateChart
          tokenTransactions={tokenTransactions}
          accumulatedType={AccumulatedTypes.rewardedToken}
        />
        <ValueOfTokensAtDateChart
          tokenContractTransactions={tokenTransactions}
          accumulatedType={AccumulatedTypes.rewardedToken}
        />
      </>
    ) : null;
  };

  const TokenMintedInContractCharts = ({ contractHistory }: { contractHistory: SmartContractHistory }) => {
    const tokenTransactions = contractHistory.transactions.filter(
      tx => tx.props.token.props.symbol === userPosition?.mintedToken,
    );
    console.log(tokenTransactions);

    return tokenTransactions.length ? (
      <>
        <NumberOfTokensAtDateChart
          tokenTransactions={tokenTransactions}
          accumulatedType={AccumulatedTypes.mintedToken}
        />
        <ValueOfTokensAtDateChart
          tokenContractTransactions={tokenTransactions}
          accumulatedType={AccumulatedTypes.mintedToken}
        />
      </>
    ) : null;
  };

  const NumberOfTokensAtDateChart = ({
    tokenTransactions,
    accumulatedType,
  }: {
    tokenTransactions: Array<Transaction>;
    accumulatedType: AccumulatedTypes;
  }) => {
    const numberOfTokensAtDate = tokenTransactions.map(tx => ({
      x: formatFromTimeStampToChartDate(tx.props.timeStamp),
      y: formatFromWeiTo2Decimals(tx.props.accumulated ? tx.props.accumulated[accumulatedType].toString() : '0'),
    }));

    return <LineChart data={numberOfTokensAtDate} />;
  };

  const ValueOfTokensAtDateChart = ({
    tokenContractTransactions,
    accumulatedType,
  }: {
    tokenContractTransactions: Array<Transaction>;
    accumulatedType: AccumulatedTypes;
  }) => {
    const valueOfTokensAtDate = tokenContractTransactions.map(tx => ({
      x: formatFromTimeStampToChartDate(tx.props.timeStamp),
      y: (
        parseFloat(
          formatFromWeiTo2Decimals(tx.props.accumulated ? tx.props.accumulated[accumulatedType].toString() : '0'),
        ) * parseFloat(tx.props.token.props.price ?? '0')
      ).toFixed(2),
    }));

    return <LineChart data={valueOfTokensAtDate} />;
  };

  const UserPosition = ({ userPosition }: { userPosition: UserSmartContractState }) => (
    <>
      <PortfolioSection position={userPosition} />
      <div style={{ height: 300 }}>
        {userPosition?.contractHistory?.transactions?.length && (
          <>
            <Row>
              <p> {userPosition?.stakedToken} in the contract </p>
              <p> Valor in $ of {userPosition?.stakedToken} in the contract </p>
            </Row>
            <Row>
              <TokenInContractCharts contractHistory={userPosition?.contractHistory} />
            </Row>
            <Row>
              <p> {userPosition?.rewardedToken} rewards of the contract</p>
              <p> Valor in $ of the {userPosition?.rewardedToken} rewards of the contract</p>
            </Row>
            <Row>
              <TokenRewardsInContractCharts contractHistory={userPosition?.contractHistory} />
            </Row>
            <Row>
              <p> {userPosition?.mintedToken} minted of the contract</p>
              <p> Valor in $ of the {userPosition?.mintedToken} minted of the contract</p>
            </Row>

            <Row>
              <TokenMintedInContractCharts contractHistory={userPosition?.contractHistory} />
            </Row>
          </>
        )}
      </div>
    </>
  );

  const ErrorMessage = ({ error }: { error: string }) => <p>{error}</p>;

  const RenderHomePage = ({ userPosition, error }) => (
    <>
      {userPosition ? <UserPosition userPosition={userPosition} /> : null}
      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
  return (
    <>
      <Helmet>
        <title>{userPosition?.stakedToken}</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <Link to={'/'}>
        <Title>{userPosition?.stakedToken}</Title>
      </Link>
      {isLoading ? <Loader /> : <RenderHomePage userPosition={userPosition} error={error} />}
    </>
  );
};
