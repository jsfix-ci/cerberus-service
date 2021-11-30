import React from 'react';
import { render } from 'react-dom';
import AppRouter from './routes';
import { KeycloakProvider } from './utils/keycloak';
import { TaskSelectedTabProvider } from './context/TaskSelectedTabContext';
import './__assets__/index.scss';

render(
  <KeycloakProvider>
    <TaskSelectedTabProvider>
      <AppRouter />
    </TaskSelectedTabProvider>
  </KeycloakProvider>,
  document.getElementById('root'),
);
