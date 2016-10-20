const storagefacilityBaseUrl = '/api/storagefacility/v1'
const thingaggregateBaseUrl = '/api/thingaggregate'

export default {
  isDev: process.env.NODE_ENV === 'development',
  isFake: process.env.FAKE_FEIDE || true,
  useDevTools: process.env.DEV_TOOLS || false,
  magasin: {
    urls: {
      storagefacility: {
        baseUrl: (museumId: number): string => `${storagefacilityBaseUrl}/museum/${museumId}/storagenodes`
      },
      objectsearch: {
        baseUrl: (museumId: number): string => `${thingaggregateBaseUrl}/museum/${museumId}/objects/search`
      }
    }
  }
};
