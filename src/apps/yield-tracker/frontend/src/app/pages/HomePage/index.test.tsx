import { render } from '@testing-library/react';
import { HomePage } from './index';
import React from 'react';
import response from '../../../api/response.json';

let mockLoading = false;
let mockEmployees = response.employees;
jest.mock('./use-employees', () => ({
  __esModule: true,
  default: () => ({
    isLoading: mockLoading,
    employees: mockEmployees,
  }),
}));
jest.mock('react-helmet-async');

describe('Pages/HomePage', () => {
  test('should render the title', () => {
    const component = render(<HomePage />);

    expect(component.getByText('Employees')).toBeTruthy();
  });

  test('should render an employee', () => {
    const component = render(<HomePage />);

    expect(component.getByText('Peter')).toBeTruthy();
    expect(component.getAllByText('junior')).toHaveLength(2);
    expect(component.getByText('James')).toBeTruthy();
  });
});
