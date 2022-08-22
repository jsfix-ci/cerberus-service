import React from 'react';
import { render } from 'react-dom';
import AppRouter from './routes';
import { KeycloakProvider } from './context/Keycloak';
import { ApplicationContextProvider } from './context/ApplicationContext';
import { TaskSelectedTabProvider } from './context/TaskSelectedTabContext';
import { PnrAccessProvider } from './context/PnrAccessContext';
import { ViewProvider } from './context/ViewContext';
import './__assets__/index.scss';

render(
  <KeycloakProvider>
    <ApplicationContextProvider>
      <ViewProvider>
        <PnrAccessProvider>
          <TaskSelectedTabProvider>
            <AppRouter />
          </TaskSelectedTabProvider>
        </PnrAccessProvider>
      </ViewProvider>
    </ApplicationContextProvider>
  </KeycloakProvider>,
  document.getElementById('root'),
);
