import { UserSmartContractState } from '../slice/types';
import * as React from 'react';
import styled from 'styled-components/macro';
import { AvailableTokens } from '../../../../modules/smartContract/domain/token';

export const SmartContractCard = ({ smartContract }: { smartContract: UserSmartContractState }) => {
  return (
    <SmartContractCardWrapper>
      <StakedTokenSection>
        <TokenImage src={smartContract.stakedTokenIcon} alt={'stakedTokenIcon'} />
        <TokenDetails>
          <StakedTokenText>{smartContract.stakedToken}</StakedTokenText>
          <StakedTokenText> {smartContract.price}</StakedTokenText>
        </TokenDetails>
      </StakedTokenSection>

      <FarmedTokensSection>
        <FarmedTokenSection>
          <StakedTokenInfo>
            <TokenImage src={smartContract.rewardedTokenIcon} alt={'stakedTokenIcon'} />
            <StakedTokenTextSection>
              <StakedTokenText>{smartContract.rewardedToken}</StakedTokenText>
              <StakedTokenText> {smartContract.profitPrice}</StakedTokenText>
            </StakedTokenTextSection>
          </StakedTokenInfo>
          <StakedTokenSmartContractBalance>
            <span> realized: {smartContract.contractHistory.withdrawnProfit}</span>
            <span> unrealized: {smartContract.profit}</span>
            <span> current: {smartContract.balance}</span>
          </StakedTokenSmartContractBalance>
        </FarmedTokenSection>

        {smartContract.mintedToken !== AvailableTokens.NOOP && (
          <FarmedTokenSection>
            <StakedTokenInfo>
              <TokenImage src={smartContract.mintedTokenIcon} alt={'stakedTokenIcon'} />
              <StakedTokenTextSection>
                <StakedTokenText>{smartContract.mintedToken}</StakedTokenText>
                <StakedTokenText> {smartContract.mintedTokenPrice} </StakedTokenText>
              </StakedTokenTextSection>
            </StakedTokenInfo>
            <StakedTokenSmartContractBalance>
              <span> realized: {smartContract.contractHistory.withdrawnMinted}</span>
            </StakedTokenSmartContractBalance>
          </FarmedTokenSection>
        )}
      </FarmedTokensSection>
    </SmartContractCardWrapper>
  );
};

const SmartContractCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border: 1px solid #1c6ea4;
  padding: 1rem;
`;

const StakedTokenSection = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;

const FarmedTokenSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const StakedTokenInfo = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;

const StakedTokenSmartContractBalance = styled.div`
  display: flex;
  flex-direction: column;
`;

const FarmedTokensSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TokenImage = styled.img`
  max-width: 2rem;
  max-height: 2rem;
`;

const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
`;

const StakedTokenTextSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
`;

const StakedTokenText = styled.span`
  font-size: 0.8rem;
  line-height: 1rem;
`;
