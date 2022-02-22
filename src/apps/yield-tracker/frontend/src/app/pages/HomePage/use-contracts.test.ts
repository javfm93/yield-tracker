import employees from '../../../api/response.json';
import { renderHook } from '@testing-library/react-hooks';
import useContracts from './use-contracts';

jest.mock('./slice', () => ({
  useHomePageSlice: () => ({
    actions: {
      loadEmployees: jest.fn(),
    },
  }),
}));
jest.mock('./slice/selectors', () => ({
  selectEmployees: 'employees',
  selectLoading: 'loading',
}));

const mockUseSelector = jest.fn();
const mockUseDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: () => mockUseSelector(),
  useDispatch: () => mockUseDispatch,
}));

describe('Pages/HomePage', () => {
  beforeEach(() => {
    mockUseSelector.mockImplementation(select => {
      if (select === 'loading') return false;
      if (select === 'employees') return employees.employees;
    });
  });
  test('should load the employees', () => {
    const hook = renderHook(() => useContracts());

    expect(mockUseDispatch).toBeCalledTimes(1);
  });
});
