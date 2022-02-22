import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectSmartContractMetricsOf, selectLoading, selectError } from './slice/selectors';
import { UserSmartContractsPlatform } from '../HomePage/slice/types';

// todo: refactor the way that we fetch prices
// todo: add a second vault in order to check the scalability of the data model
// todo: TEST TEST AND TEST!!!
// smartContract
// history -> getStakedTx / getProfitsTx / getMintedTx
export default function useSmartContract() {
  const { platform, address } = useParams<{ platform: UserSmartContractsPlatform['name']; address: string }>();
  const isLoading = useSelector(selectLoading);
  const userPosition = useSelector(selectSmartContractMetricsOf(platform, address));
  const error = useSelector(selectError);

  return { isLoading, userPosition, error };
}
