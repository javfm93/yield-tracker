import * as React from 'react';
import { ThemeProvider } from 'styled-components';

const mainTheme = {
  primary: 'rgba(215,113,88,1)',
  text: 'rgba(58,52,51,1)',
  textSecondary: 'rgba(58,52,51,0.7)',
  background: 'rgba(255,255,255,1)',
  backgroundVariant: 'rgba(251,249,249,1)',
  border: 'rgba(58,52,51,0.12)',
  borderLight: 'rgba(58,52,51,0.05)',
};

export type Theme = typeof mainTheme;

export default (props: { children: React.ReactChild }) => {
  return (
    <ThemeProvider theme={mainTheme}>
      {React.Children.only(props.children)}
    </ThemeProvider>
  );
};
