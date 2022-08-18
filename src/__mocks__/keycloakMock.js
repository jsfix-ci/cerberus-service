jest.mock('../context/Keycloak', () => ({
  KeycloakProvider: ({ children }) => children,
  useKeycloak: () => ({
    token: 'token',
    authServerUrl: 'test',
    realm: 'test',
    clientId: 'client',
    refreshToken: 'refreshToken',
    sessionId: '123-456',
    tokenParsed: {
      given_name: 'test',
      family_name: 'test',
      email: 'test',
      realm_access: {
        roles: ['test'],
      },
      team_id: '21',
      groups: ['/bf-intel-targeters'],
    },
    createLogoutUrl: jest.fn(() => 'http://example.com/logout'),
    logout: jest.fn(() => ({
      pathname: '/example',
    })),
  }),
}));
