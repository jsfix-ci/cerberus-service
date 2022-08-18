import React from 'react';
import { render } from 'react-dom';
import AppRouter from './routes';
import { KeycloakProvider } from './utils/keycloak';
import { ApplicationContextProvider } from './context/ApplicationContext';
import { TaskSelectedTabProvider } from './context/TaskSelectedTabContext';
import { PnrAccessProvider } from './context/PnrAccessContext';
import './__assets__/index.scss';

render(
  <KeycloakProvider>
    <ApplicationContextProvider>
      <PnrAccessProvider>
        <TaskSelectedTabProvider>
          <AppRouter />
        </TaskSelectedTabProvider>
      </PnrAccessProvider>
    </ApplicationContextProvider>
  </KeycloakProvider>,
  document.getElementById('root'),
);
