import { AppSession } from './modules/app/appSession';

const clientContextUrl = (appSession: AppSession) => `/${appSession.getMuseumId().getPath()}/${appSession.getCollectionId().getPath()}`;

export default {
  isDev: process.env.NODE_ENV === 'development',
  isFake: false,
  useDevTools: process.env.DEV_TOOLS || false,
  print: {
    labelConfig: {
      codeFormat: { 4: 2 },
      canSelectPath: { 4: true, 5: true }
    }
  },
  magasin: {
    limit: 25,
    urls: {
      client: {
        analysis: {
          addAnalysis: (appSession: AppSession) =>
          `${clientContextUrl(appSession)}/analysis/add`,
          addSample: () =>
            '/analysis/sample/add'
        },
        magasin: {
          goToMagasin: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin`
        },
        report: {
          goToReport: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/reports`,
          goToKdReport: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/reports/kdreport`
        },
        picklist: {
          goToPicklistObjects: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/picklist/objects`,
          goToPicklistNodes: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/picklist/nodes`
        },
        searchObjects: {
          goToSearchObjects: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/search/objects`
        },
        storagefacility: {
          goToRoot: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin`,
          goToNode: (id, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${id}`,
          addNode: (id, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${id}/add`,
          editNode: (id, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${id}/view`,
          goToObjects: (id, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${id}/objects`,
          addObservation: (id, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${id}/observation/add`,
          editObservation: (id, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${id}/observation/edit`,
          viewObservation: (nodeId, observationId, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/observation/${observationId}`,
          addControl: (id, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${id}/control/add`,
          viewControl: (nodeId, controlId, appSession : AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/control/${controlId}`,
          viewControlsObservations: (id, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${id}/controlsobservations`
        }
      },
      api: {
        analysisType: {
          getAllAnalysisTypes: (mid) =>
            `api/management/${mid.id}/analyses/types`,
          getAnalysisById: (mid, id) =>
            `api/management/${mid.id}/analyses/types/${id}`,
          getAnalysisTypesForCategory: (mid, id) =>
            `api/management/${mid.id}/analyses/types/categories/${id}`,
          getAnalysisTypesForCollection: (mid, id) =>
            `api/management/${mid.id}/analyses/types/musemcollections/${id}`
        },
        analysis: {
          saveAnalysisEvent: (mid) =>
          `api/management/${mid.id}/analyses`,
          getAnalysisById: (mid, id) =>
            `api/management/${mid.id}/analyses/${id}`,
          getChildAnalyses: (mid, id) =>
            `api/management/${mid.id}/analyses/${id}/children`,
          saveResult: (mid, id) =>
            `api/management/${mid.id}/analyses/${id}/results`,
          getAnalysisForObject: (mid, id) =>
            `api/management/${mid.id}/analyses/objects/${id}`
        },
        samples: {
          baseUrl: (mid): string =>
            `api/management/${mid.id}/samples`
        },
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
            `/api/thingaggregate/${mid.getPath()}/scan?oldBarcode=${oldBarcode}&${collectionId.getQuery()}`,
          searchObjectUrl: (museumNo, subNo, term, perPage, page, collectionId, museumId) : string => {
            const baseUrl = `/api/thingaggregate/${museumId.getPath()}/objects/search`;
            const museumNoQuery = `museumNo=${museumNo || ''}`;
            const subNoQuery = `subNo=${subNo || ''}`;
            const termQuery = `term=${term || ''}`;
            const pageQuery = `page=${page || ''}`;
            const limitQuery = `limit=${perPage || ''}`;
            return `${baseUrl}?${museumNoQuery}&${subNoQuery}&${termQuery}&${pageQuery}&${limitQuery}&${collectionId.getQuery()}`;
          }
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
  }
};
