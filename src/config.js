// Remember to also update run.sh, Dockerfile and webpack.config.js
const config = {
  keycloak: {
    clientConfig: {
      realm: process.env.KEYCLOAK_REALM,
      url: process.env.KEYCLOAK_AUTH_URL,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
    },
    initOptions: {
      onLoad: 'login-required',
      checkLoginIframe: false,
    },
  },
  refdataApiUrl: process.env.REFDATA_API_URL,
  formApiUrl: process.env.FORM_API_URL,
  camundaApiUrl: '/camunda/engine-rest',
  camundaApiUrlV1: '/camunda/v1',
  taskApiUrl: '/v2',
  dayjsConfig: {
    relativeTime: {
      future: '%s before travel',
      past: '%s ago',
      s: 'a few seconds',
      m: 'a minute',
      mm: '%d minutes',
      h: 'an hour',
      hh: '%d hours',
      d: 'a day',
      dd: '%d days',
      M: 'a month',
      MM: '%d months',
      y: 'a year',
      yy: '%d years',
    },
    timezone: 'Europe/London',
  },
};

export default config;
