export default {
  isDev: process.env.NODE_ENV === 'development',
  isFake: process.env.FAKE_FEIDE || true,
  useDevTools: process.env.DEV_TOOLS || false,
  magasin: {
    urls: {
      storagefacility: {
        searchUrl:
          '/api/storagefacility/v1/museum/%museumId%/storagenodes/search?searchStr=%term%&',
        baseUrl: (mid): string =>
          `/api/storagefacility/v1/${mid.getPath()}/storagenodes`
      },
      thingaggregate: {
        baseUrl: (mid): string =>
          `/api/thingaggregate/${mid.getPath()}`
      },
      actor: {
        searchUrl:
          '/api/actor/v1/person?museumId=%museumId%&search=[%term%]',
        baseUrl:
          '/api/actor/v1/person'
      }
    }
  }
};
