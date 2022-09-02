import React, {
  createContext, useState, useContext, useEffect,
} from 'react';
import Keycloak from 'keycloak-js';
import { useInterval } from 'react-use';

import config from '../utils/config';

const KeycloakContext = createContext();

const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [refreshToken, setRefreshToken] = useState(false);
  const keycloakInstance = Keycloak(config.keycloak.clientConfig);

  useInterval(() => {
    /**
    * isTokenExpired(minValidity)
    * Returns true if the token has less than minValidity seconds left before
    * it expires (minValidity is optional, if not specified 0 is used)
    */
    if (keycloak.isTokenExpired(config.keycloak.minExpiryValidity)) {
      setRefreshToken(!refreshToken);
    }
  }, config.keycloak.pollingInterval);

  useEffect(() => {
    if (keycloak) {
      keycloak
        .updateToken()
        .catch(() => {
          keycloak.logout();
        });
    }
  }, [refreshToken]);

  useEffect(() => {
    keycloakInstance.init(config.keycloak.initOptions).then((authenticated) => {
      if (authenticated) {
        setKeycloak(keycloakInstance);
      } else {
        keycloakInstance.login();
      }
    });
  }, []);

  return <KeycloakContext.Provider value={keycloak}>{children}</KeycloakContext.Provider>;
};

const useKeycloak = () => useContext(KeycloakContext);

export { KeycloakContext, KeycloakProvider, useKeycloak };
