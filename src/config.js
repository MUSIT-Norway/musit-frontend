// @flow

import type { MuseumId, CollectionId, NodeId } from 'types/ids';

type AppSession = {
  museumId: number,
  collectionId: string,
  accessToken: string
};

const clientContextUrl = (appSession: AppSession) =>
  `/museum/${appSession.museumId}/collections/${appSession.collectionId}`;

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
        administration: {
          goToAdministration: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/administration`,
          goToAnalysisTypes: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/administration/analysistypes`,
          goToAnalysisPlaces: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/administration/analysisplaces`,
          goToSampleTypes: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/administration/sampletypes`
        },
        homePage: '/home',
        analysis: {
          baseUrl: (appSession: AppSession) => `${clientContextUrl(appSession)}/analysis`,
          editAnalysis: (appSession: AppSession, analysisId: string) =>
            `${clientContextUrl(appSession)}/analysis/edit/${analysisId}`,
          addAnalysis: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/analysis/add`,
          viewAnalysis: (appSession: AppSession, analysisId: number) =>
            `${clientContextUrl(appSession)}/analysis/${analysisId}`,
          addSample: (appSession: AppSession, objectId: string) =>
            `${clientContextUrl(appSession)}/analysis/sample/${objectId}/add`,
          gotoSample: (appSession: AppSession, sampleId: string) =>
            `${clientContextUrl(appSession)}/analysis/sample/${sampleId}`,
          editSample: (appSession: AppSession, sampleId: string) =>
            `${clientContextUrl(appSession)}/analysis/sample/${sampleId}/edit`
        },
        magasin: {
          goToMagasin: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin`
        },
        object: {
          gotoObject: (appSession: AppSession, id: string) =>
            `${clientContextUrl(appSession)}/objects/${id}`
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
          goToRoot: (appSession: AppSession) => `${clientContextUrl(appSession)}/magasin`,
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
          viewObservation: (
            nodeId: number,
            observationId: number,
            appSession: AppSession
          ) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/observation/${observationId}`,
          addControl: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/control/add`,
          viewControl: (nodeId: string, controlId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/control/${controlId}`,
          viewControlsObservations: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/controlsobservations`
        }
      },
      api: {
        analysisType: {
          getAllAnalysisTypes: (mid: MuseumId) => `/api/management/${mid}/analyses/types`,
          getAnalysisCategories: (mid: MuseumId) =>
            `/api/management/${mid}/analyses/categories`,
          getAnalysisTypesForCategory: (mid: MuseumId, categoryId: string) =>
            `/api/management/${mid}/analyses/types/categories/${categoryId}`,
          getAnalysisTypesForCollection: (mid: MuseumId, musuemcollectionId: string) =>
            `/api/management/${mid}/analyses/types?collectionIds=${musuemcollectionId}`
        },
        analysis: {
          resultsUrl: (mid: MuseumId, analysisId: number) =>
            `/api/management/${mid}/analyses/${analysisId}/results`,
          saveAnalysisEvent: (mid: MuseumId) => `/api/management/${mid}/analyses`,
          getAnalysisById: (mid: MuseumId, analysisId: number) =>
            `/api/management/${mid}/analyses/${analysisId}`,
          getChildAnalyses: (mid: MuseumId, analysisId: number) =>
            `/api/management/${mid}/analyses/${analysisId}/children`,
          saveResult: (mid: MuseumId, analysisId: number) =>
            `/api/management/${mid}/analyses/${analysisId}/results`,
          getAnalysisForObject: (mid: MuseumId, id: number) =>
            `/api/management/${mid}/analyses/objects/${id}`,
          analysesForObject: (mid: MuseumId, objectId: number): string =>
            `/api/management/${mid}/analyses/objects/${objectId}`,
          saveAnalysisType: (mid: MuseumId) => `/api/management/${mid}/analyses/types`,
          getPurposes: '/api/management/purposes'
        },
        samples: {
          baseUrl: (mid: MuseumId): string => `/api/management/${mid}/samples`,
          sampleTypes: '/api/management/sampletypes',
          samplesForObject: (mid: MuseumId, objectId: number): string =>
            `/api/management/${mid}/samples/${objectId}/children`,
          treatments: '/api/management/treatments',
          storagecontainer: '/api/management/storagecontainer',
          storagemediums: '/api/management/storagemediums'
        },
        storagefacility: {
          searchUrl: (term: string, mid: MuseumId) =>
            `/api/storagefacility/museum/${mid}/storagenodes/search?searchStr=${encodeURIComponent(term)}&`,
          scanUrl: (storageNodeId: string, mid: MuseumId) =>
            `/api/storagefacility/museum/${mid}/storagenodes/scan?storageNodeId=${storageNodeId}&`,
          scanOldUrl: (oldBarcode: number, mid: MuseumId) =>
            `/api/storagefacility/museum/${mid}/storagenodes/scan?oldBarcode=${oldBarcode}`,
          baseUrl: (mid: MuseumId): string =>
            `/api/storagefacility/museum/${mid}/storagenodes`,
          rootNodeUrl: (mid: MuseumId): string =>
            `/api/storagefacility/museum/${mid}/storagenodes/root`,
          nodeUrl: (mid: MuseumId, uuid: string): string =>
            `/api/storagefacility/museum/${mid}/storagenodes/${uuid}`,
          childrenNodesUrl: (
            mid: MuseumId,
            uuid: string,
            pageNum: ?number,
            limit: ?number
          ): string =>
            `/api/storagefacility/museum/${mid}/storagenodes/${uuid}/children?page=${pageNum || 1}&limit=${limit || 25}`,
          currentLocation: (mid: MuseumId, objectId: number): string =>
            `/api/storagefacility/museum/${mid}/storagenodes/objects/${objectId}/currentlocation`,
          currentLocations: (mid: MuseumId): string =>
            `/api/storagefacility/museum/${mid}/storagenodes/objects/currentlocations`,
          moveObject: (mid: MuseumId): string =>
            `/api/storagefacility/museum/${mid}/storagenodes/moveObject`,
          moveNodeUrl: (mid: MuseumId): string =>
            `/api/storagefacility/museum/${mid}/storagenodes/moveNode`,
          objectLocations: (mid: MuseumId, objectId: number): string =>
            `/api/storagefacility/museum/${mid}/storagenodes/objects/${objectId}/locations`
        },
        thingaggregate: {
          baseUrl: (mid: MuseumId): string => `/api/thingaggregate/museum/${mid}`,
          scanOldUrl: (oldBarcode: number, mid: MuseumId, collectionId: CollectionId) =>
            `/api/thingaggregate/museum/${mid}/scan?oldBarcode=${oldBarcode}&collectionIds=${collectionId}`,
          nodeStatsUrl: (mid: MuseumId, uuid: string): string =>
            `/api/thingaggregate/museum/${mid}/storagenodes/${uuid}/stats`,
          searchObjectUrl: (
            museumNo: ?string,
            subNo: ?string,
            term: ?string,
            perPage: ?number,
            page: ?number,
            collectionId: CollectionId,
            museumId: MuseumId
          ): string => {
            const baseUrl = `/api/thingaggregate/museum/${museumId}/objects/search`;
            const museumNoQuery = `museumNo=${museumNo || ''}`;
            const subNoQuery = `subNo=${subNo || ''}`;
            const termQuery = `term=${term || ''}`;
            const pageQuery = `page=${page || ''}`;
            const limitQuery = `limit=${perPage || ''}`;
            return `${baseUrl}?${museumNoQuery}&${subNoQuery}&${termQuery}&${pageQuery}&${limitQuery}&collectionIds=${collectionId}`;
          },
          objectDetailsUrl: (
            mid: MuseumId,
            objectId: NodeId,
            collectionId: CollectionId
          ): string =>
            `/api/thingaggregate/museum/${mid}/objects/${objectId}?collectionIds=${collectionId}`,
          getMainObject: (
            mid: MuseumId,
            objectId: NodeId,
            collectionId: CollectionId
          ): string =>
            `/api/thingaggregate/museum/${mid}/objects/${objectId}/children?collectionIds=${collectionId}`,
          getObjectForCollection: (
            mid: MuseumId,
            nodeId: NodeId,
            collectionId: CollectionId,
            page: number,
            limit: number
          ): string =>
            `/api/thingaggregate/museum/${mid}/node/${nodeId}/objects?collectionIds=${collectionId}&page=${page}&limit=${limit}`
        },
        actor: {
          searchUrl: (term: string, mid: MuseumId): string =>
            `/api/actor/person?museumId=${mid}&search=[${encodeURIComponent(term)}]`,
          baseUrl: '/api/actor/person',
          currentUser: '/api/actor/dataporten/currentUser',
          getLabList: '/api/actor/organisation/labs'
        },
        geolocation: {
          searchUrl: (term: string): string =>
            `/api/geolocation/address?search=[${encodeURIComponent(term)}]`
        },
        barcode: {
          templatesUrl: '/api/barcode/templates',
          templateRenderUrl: (templateId: number, format: number) =>
            `/api/barcode/templates/${templateId}/render?codeFormat=${format}`
        },
        auth: {
          groupsUrl: (feideEmail: string): string =>
            `/api/auth/rest/groups/${feideEmail}`,
          museumsUrl: '/api/auth/rest/museums',
          buildInfo: '/api/auth/service/auth/buildinfo'
        }
      }
    }
  }
};
