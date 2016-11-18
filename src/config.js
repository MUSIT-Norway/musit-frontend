export default {
  isDev: process.env.NODE_ENV === 'development',
  isFake: process.env.FAKE_FEIDE || true,
  useDevTools: process.env.DEV_TOOLS || false,
  magasin: {
    urls: {
      storagefacility: {
        baseUrl: (museumId: number): string =>
          `/api/storagefacility/v1/museum/${museumId}/storagenodes`
      },
      thingaggregate: {
        baseUrl: (museumId: number): string =>
          `/api/thingaggregate/museum/${museumId}`
      },
      actor: {
        baseUrl: '/api/actor/v1/person'
      }
    }
  }
};
