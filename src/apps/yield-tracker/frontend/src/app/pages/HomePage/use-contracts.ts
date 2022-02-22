import { useEffect } from 'react';
import { useHomePageSlice } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserPosition, selectLoading, selectError } from './slice/selectors';

// todo: refactor the way that we fetch prices
// todo: add a second vault in order to check the scalability of the data model
// todo: TEST TEST AND TEST!!!
export default function useContracts() {
  const { actions } = useHomePageSlice();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);
  const userPosition = useSelector(selectUserPosition);
  const error = useSelector(selectError);

  useEffect(() => {
    if (!userPosition) dispatch(actions.loadContractDetails());
  }, []);

  return { isLoading, userPosition, error };
}
