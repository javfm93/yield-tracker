import styled from 'styled-components/macro';
import { Theme } from '../../styles/theme/ThemeProvider';

export default styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: ${(p: { theme: Theme }) => p.theme.text};
  margin: 1rem 0;
`;
