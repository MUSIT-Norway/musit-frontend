/* @flow */
import { AppSession } from './modules/app/appSession';
import CollectionId from './models/collectionId';
import MuseumId from './models/museumId';

const clientContextUrl = (appSession: AppSession) => `/${appSession.getMuseumId().getPath()}/${appSession.getCollectionId().getPath()}`;

export default {
  isDev: process.env.NODE_ENV === 'development',
  isFake: false,
  useDevTools: process.env.DEV_TOOLS || false,
  print: {
    labelConfig: {
      codeFormat: { '4': 2 },
      canSelectPath: { '4': true, '5': true }
    }
  },
  magasin: {
    limit: 25,
    urls: {
      client: {
        analysis: {
          editAnalysis: (appSession: AppSession, analysisId: string) =>
            `${clientContextUrl(appSession)}/analysis/edit/${analysisId}`,
          addAnalysis: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/analysis/add`,
          addSample: () =>
            '/analysis/sample/add',
          gotoSample: (sampleId: string) =>
            `/analysis/sample/${sampleId}`,
          editSample: (sampleId: string) =>
            `/analysis/sample/${sampleId}/edit`,
          sampleForObject: (sampleId: string) =>
            `/analysis/sample/objects/${sampleId}`
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
          goToNode: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}`,
          addNode: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/add`,
          editNode: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/view`,
          goToObjects: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/objects`,
          addObservation: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/observation/add`,
          editObservation: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/observation/edit`,
          viewObservation: (nodeId: number, observationId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/observation/${observationId}`,
          addControl: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/control/add`,
          viewControl: (nodeId: number, controlId: number, appSession : AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/control/${controlId}`,
          viewControlsObservations: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/controlsobservations`
        }
      },
      api: {
        analysisType: {
          getAllAnalysisTypes: (mid: MuseumId) =>
            `/api/management/${mid.id}/analyses/types`,
          getAnalysisTypesForCategory: (mid: MuseumId, categoryId: string) =>
            `/api/management/${mid.id}/analyses/types/categories/${categoryId}`,
          getAnalysisTypesForCollection: (mid: MuseumId, musemcollectionId: string) =>
            `/api/management/${mid.id}/analyses/types/musemcollections/${musemcollectionId}`
        },
        analysis: {
          saveAnalysisEvent: (mid: MuseumId) =>
            `/api/management/${mid.id}/analyses`,
          getAnalysisById: (mid: MuseumId, analysisId: number) =>
            `/api/management/${mid.id}/analyses/${analysisId}`,
          getChildAnalyses: (mid: MuseumId, analysisId: number) =>
            `/api/management/${mid.id}/analyses/${analysisId}/children`,
          saveResult: (mid: MuseumId, analysisId: number) =>
            `/api/management/${mid.id}/analyses/${analysisId}/results`,
          getAnalysisForObject: (mid: MuseumId, id: number) =>
            `/api/management/${mid.id}/analyses/objects/${id}`,
          analysesForObject: (mid: MuseumId, objectId: number): string =>
            `/api/management/${mid.id}/analyses/objects/${objectId}`
        },
        samples: {
          baseUrl: (mid: MuseumId): string =>
            `api/management/${mid.id}/samples`,
          samplesForObject: (mid: MuseumId, objectId: number): string =>
            `api/management/${mid.id}/samples/${objectId}/children`
        },
        storagefacility: {
          searchUrl: (term: string, mid: MuseumId) =>
            `/api/storagefacility/${mid.getPath()}/storagenodes/search?searchStr=${encodeURIComponent(term)}&`,
          scanUrl: (storageNodeId: string, mid: MuseumId) =>
            `/api/storagefacility/${mid.getPath()}/storagenodes/scan?storageNodeId=${storageNodeId}&`,
          scanOldUrl: (oldBarcode: number, mid: MuseumId) =>
            `/api/storagefacility/${mid.getPath()}/storagenodes/scan?oldBarcode=${oldBarcode}`,
          baseUrl: (mid: MuseumId): string =>
            `/api/storagefacility/${mid.getPath()}/storagenodes`,
          currentLocation: (mid: MuseumId, objectId: number): string =>
            `/api/storagefacility/${mid.getPath()}/storagenodes/objects/${objectId}/currentlocation`,
          currentLocations: (mid: MuseumId): string =>
            `/api/storagefacility/${mid.getPath()}/storagenodes/objects/currentlocations`,
          moveObject: (mid: MuseumId): string =>
            `/api/storagefacility/${mid.getPath()}/storagenodes/moveObject`,
          objectLocations: (mid: MuseumId, objectId: number): string =>
            `/api/storagefacility/${mid.getPath()}/storagenodes/objects/${objectId}/locations`
        },
        thingaggregate: {
          baseUrl: (mid: MuseumId): string =>
            `/api/thingaggregate/${mid.getPath()}`,
          scanOldUrl: (oldBarcode: number, mid: MuseumId, collectionId: CollectionId) =>
            `/api/thingaggregate/${mid.getPath()}/scan?oldBarcode=${oldBarcode}&${collectionId.getQuery()}`,
          searchObjectUrl: (
              museumNo: ?string,
              subNo: ?string,
              term: ?string,
              perPage: ?number,
              page: ?number,
              collectionId: CollectionId,
              museumId: MuseumId
          ) : string => {
            const baseUrl = `/api/thingaggregate/${museumId.getPath()}/objects/search`;
            const museumNoQuery = `museumNo=${museumNo || ''}`;
            const subNoQuery = `subNo=${subNo || ''}`;
            const termQuery = `term=${term || ''}`;
            const pageQuery = `page=${page || ''}`;
            const limitQuery = `limit=${perPage || ''}`;
            return `${baseUrl}?${museumNoQuery}&${subNoQuery}&${termQuery}&${pageQuery}&${limitQuery}&${collectionId.getQuery()}`;
          },
          objectDetailsUrl: (mid: MuseumId, objectId: number, collectionId: CollectionId): string =>
            `api/thingaggregate/${mid.getPath()}/objects/${objectId}?${collectionId.getQuery()}`,
          getMainObject: (mid: MuseumId, objectId: number, collectionId: CollectionId): string =>
            `/api/thingaggregate/${mid.getPath()}/objects/${objectId}/children?${collectionId.getQuery()}`,
          getObjectForCollection: (mid: MuseumId, nodeId: number, collectionId: CollectionId, page: number, limit: number): string =>
            `/api/thingaggregate/${mid.getPath()}/node/${nodeId}/objects?${collectionId.getQuery()}&page=${page}&limit=${limit}`
        },
        actor: {
          searchUrl: (term: string, mid: MuseumId): string =>
            `/api/actor/person?${mid.getQuery()}&search=[${encodeURIComponent(term)}]`,
          baseUrl:
            '/api/actor/person',
          currentUser:
            '/api/actor/dataporten/currentUser'
        },
        geolocation: {
          searchUrl: (term: string): string =>
            `/api/geolocation/address?search=[${encodeURIComponent(term)}]`
        },
        barcode: {
          templatesUrl:
            '/api/barcode/templates',
          templateRenderUrl: (templateId: number, format: number) =>
            `/api/barcode/templates/${templateId}/render?codeFormat=${format}`
        },
        auth: {
          groupsUrl: (feideEmail: string): string =>
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
