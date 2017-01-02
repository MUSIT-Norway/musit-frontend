export default {
  isDev: process.env.NODE_ENV === 'development',
  isFake: false,
  useDevTools: process.env.DEV_TOOLS || false,
  print: { labelConfig: { 4: 2 } },
  magasin: {
    limit: 25,
    urls: {
      storagefacility: {
        searchUrl: (term, mid) =>
          `/api/storagefacility/v1/${mid.getPath()}/storagenodes/search?searchStr=${encodeURIComponent(term)}&`,
        scanUrl: (uuid, mid) =>
          `/api/storagefacility/v1/${mid.getPath()}/storagenodes/scan?storageNodeId=${uuid}&`,
        scanOldUrl: (oldBarcode, mid) =>
          `/api/storagefacility/v1/${mid.getPath()}/storagenodes/scan?oldBarcode=${oldBarcode}`,
        baseUrl: (mid): string =>
          `/api/storagefacility/v1/${mid.getPath()}/storagenodes`
      },
      thingaggregate: {
        baseUrl: (mid): string =>
          `/api/thingaggregate/${mid.getPath()}`,
        scanOldUrl: (oldBarcode, mid, collectionId) =>
          `/api/thingaggregate/${mid.getPath()}/scan?oldBarcode=${oldBarcode}&${collectionId.getQuery()}`
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
          `/api/barcode/templates/${id}/preview?codeFormat=${format}&name=${name}&uuid=${uuid}`,
        templateRenderUrl: (id, format) =>
          `/api/barcode/templates/${id}/render?codeFormat=${format}`
      },
      auth: {
        groupsUrl: (feideEmail) =>
          `/api/auth/rest/groups/${feideEmail}`,
        museumsUrl:
          '/api/auth/rest/museums',
        buildInfo:
          '/api/auth/service/auth/buildinfo'
      }
    }
  }
};
