export default {
  isDev: process.env.NODE_ENV === 'development',
  isFake: false,
  useDevTools: process.env.DEV_TOOLS || false,
  magasin: {
    urls: {
      storagefacility: {
        searchUrl: (term, mid) =>
          `/api/storagefacility/v1/${mid.getPath()}/storagenodes/search?searchStr=${encodeURIComponent(term)}&`,
        baseUrl: (mid): string =>
          `/api/storagefacility/v1/${mid.getPath()}/storagenodes`
      },
      thingaggregate: {
        baseUrl: (mid): string =>
          `/api/thingaggregate/${mid.getPath()}`
      },
      actor: {
        searchUrl: (term, mid) =>
          `/api/actor/v1/person?${mid.getQuery()}&search=[${encodeURIComponent(term)}]`,
        baseUrl:
          '/api/actor/v1/person',
        currentUser:
          '/api/actor/v1/dataporten/currentUser'
      },
      geolocation: {
        searchUrl: (term) =>
          `/api/geolocation/v1/address?search=[${encodeURIComponent(term)}]`
      },
      barcode: {
        templatesUrl:
          '/api/barcode/templates',
        templatePreviewUrl: (id, format, name, uuid) =>
          `/api/barcode/templates/${id}/preview?codeFormat=${format}&name=${name}&uuid=${uuid}`
      }
    }
  }
};
