jest.mock('../../src/utils/keycloak', () => ({
  KeycloakProvider: ({ children }) => children,
  useKeycloak: () => ({
    token: 'token',
    authServerUrl: 'test',
    realm: 'test',
    clientId: 'client',
    refreshToken: 'refreshToken',
    tokenParsed: {
      given_name: 'test',
      family_name: 'test',
      email: 'test',
      realm_access: {
        roles: ['test'],
      },
      team_id: '21',
      groups: ['non-targeter-group'],
    },
    createLogoutUrl: jest.fn(() => 'http://example.com/logout'),
    logout: jest.fn(() => ({
      pathname: '/example',
    })),
  }),
}));
