export default {
  isDev: process.env.NODE_ENV === 'development',
  isFake: process.env.FAKE_FEIDE || true,
  useDevTools: process.env.DEV_TOOLS || false,
  magasin: {
    urls: {
      storagefacility: {
        baseUrl: (museumId): string =>
          `/api/storagefacility/v1/${museumId.getPath()}/storagenodes`
      },
      thingaggregate: {
        baseUrl: (museumId): string =>
          `/api/thingaggregate/${museumId.getPath()}`
      },
      actor: {
        baseUrl: '/api/actor/v1/person'
      }
    }
  }
};
