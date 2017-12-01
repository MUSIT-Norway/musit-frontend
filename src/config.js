// @flow

import type { MuseumId, CollectionId, NodeId, ObjectId } from 'types/ids';
import queryParams from './shared/queryParams';

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
            `${clientContextUrl(appSession)}/administration/sampletypes`,
          goToConservationTypes: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/administration/conservationtypes`
        },
        homePage: '/home',
        aboutPage: '/about',
        conservation: {
          editConservation: (appSession: AppSession, conservationId: number) =>
            `${clientContextUrl(appSession)}/conservation/edit/${conservationId}`,
          addConservation: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/conservation/add`,
          viewConservation: (appSession: AppSession, conservationId: number) =>
            `${clientContextUrl(appSession)}/conservation/${conservationId}`
        },
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
          addMultipleSamples: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/analysis/sample/add`,
          addFromSample: (appSession: AppSession, sampleId: string) =>
            `${clientContextUrl(appSession)}/analysis/sample/${sampleId}/fromSample`,
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
          goToNode: (nodeId: number, appSession: AppSession, page?: ?number) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}${page ? `/${page}` : ''}`,
          addNode: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/add`,
          editNode: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/view`,
          goToObjects: (nodeId: number, appSession: AppSession, page?: ?number) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/objects${page
              ? `/${page}`
              : ''}`,
          goToSamples: (nodeId: number, appSession: AppSession, page?: ?number) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/samples${page
              ? `/${page}`
              : ''}`,
          addObservation: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/observation/add`,
          editObservation: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/observation/edit`,
          viewObservation: (
            nodeId: number,
            observationId: number,
            appSession: AppSession
          ) =>
            `${clientContextUrl(
              appSession
            )}/magasin/${nodeId}/observation/${observationId}`,
          addControl: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/control/add`,
          viewControl: (nodeId: string, controlId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/control/${controlId}`,
          viewControlsObservations: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/controlsobservations`
        }
      },
      api: {
        conservation: {
          getConditionCodeList: `/api/management/conservation/conditionCodes`,
          getMaterialList: `/api/management/conservation/treatmentMaterials`,
          getKeywordList: `/api/management/conservation/treatmentKeywords`,
          getRoleList: `/api/management/conservation/roles`,
          getAllConservationTypes: (mid: MuseumId) =>
            `/api/management/${mid}/conservation/types`,
          addConservationEvent: (mid: MuseumId) =>
            `/api/management/${mid}/conservation/events`,
          getConservationById: (mid: MuseumId, conservationId: number) =>
            `/api/management/${mid}/conservation/events/${conservationId}`,
          getConservationForObject: (mid: MuseumId, id: number) =>
            `/api/management/${mid}/conservation/events/object/${id}`
        },
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
          addFileUrl: (mid: MuseumId, collectionId: CollectionId, analysisId: number) =>
            `/api/document/museum/${mid}/analyses/attachments?analysisId=${analysisId}&collectionId=${collectionId}`,
          getFilesUrl: (files: Array<string>, mid: MuseumId, analysisId: number) =>
            `/api/document/museum/${mid}/analyses/attachments?analysisId=${analysisId}&fileIds=${files.join(
              ','
            )}`,
          getFileUrl: (file: string, mid: MuseumId) =>
            `/api/document/museum/${mid}/analyses/attachments/${file}`,
          saveAnalysisEvent: (mid: MuseumId) => `/api/management/${mid}/analyses`,
          getAnalysisById: (mid: MuseumId, analysisId: number) =>
            `/api/management/${mid}/analyses/${analysisId}`,
          getChildAnalyses: (mid: MuseumId, analysisId: number) =>
            `/api/management/${mid}/analyses/${analysisId}/children`,
          saveResult: (mid: MuseumId, analysisId: number) =>
            `/api/management/${mid}/analyses/${analysisId}/results`,
          importResults: (mid: MuseumId, analysisId: number) =>
            `/api/management/${mid}/analyses/${analysisId}/results/import`,
          getAnalysisForObject: (mid: MuseumId, id: number) =>
            `/api/management/${mid}/analyses/objects/${id}`,
          analysesForObject: (mid: MuseumId, objectId: number): string =>
            `/api/management/${mid}/analyses/objects/${objectId}`,
          getPurposes: '/api/management/purposes',
          search: (
            mid: MuseumId,
            collectionIds: string,
            from: number,
            limit: number,
            q: ?string
          ) =>
            `/api/management/${mid}/analyses/search` +
            queryParams({
              from,
              limit,
              collectionIds,
              q,
              types: ['analysis', 'analysisCollection']
            }),
          getAnalysisEvents: (mid: MuseumId, collectionIds: Array<CollectionId>) =>
            `/api/management/${mid}/analyses?collectionIds=${collectionIds.join(',')}`
        },
        samples: {
          baseUrl: (mid: MuseumId): string => `/api/management/${mid}/samples`,
          sampleTypes: '/api/management/sampletypes',
          childrenSamples: (mid: MuseumId, objectId: string): string =>
            `/api/management/${mid}/samples/${objectId}/children`,
          originatedFromObject: (mid: MuseumId, objectId: string): string =>
            `/api/management/${mid}/samples/${objectId}/all`,
          treatments: '/api/management/treatments',
          storagecontainer: '/api/management/storagecontainer',
          storagemediums: '/api/management/storagemediums',
          getSample: (mid: MuseumId, sampleId: string) =>
            `/api/management/${mid}/samples/${sampleId}`,
          samplesForNode: (
            mid: MuseumId,
            nodeId: NodeId,
            collectionId: CollectionId
          ): string =>
            `/api/management/${mid}/node/${nodeId}/samples?collectionIds=${collectionId}`
        },
        storagefacility: {
          searchUrl: (term: string, mid: MuseumId) =>
            `/api/storagefacility/museum/${mid}/storagenodes/search?searchStr=${encodeURIComponent(
              term
            )}&`,
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
            `/api/storagefacility/museum/${mid}/storagenodes/${uuid}/children?page=${pageNum ||
              1}&limit=${limit || 25}`,
          currentLocation: (
            mid: MuseumId,
            objectId: string,
            objectType?: ?string
          ): string =>
            `/api/storagefacility/museum/${mid}/storagenodes/objects/${objectId}/currentlocation?objectType=${objectType ||
              'collection'}`,
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
            q: ?string,
            limit: number,
            from: number,
            collectionId: CollectionId,
            museumId: MuseumId
          ): string => {
            const baseUrl = `/api/thingaggregate/museum/${museumId}/objects/search`;
            const qs = queryParams({
              museumNo,
              subNo,
              term,
              from,
              limit,
              q,
              collectionIds: collectionId
            });
            return baseUrl + qs;
          },
          objectDetailsUrl: (
            mid: MuseumId,
            objectId: ObjectId,
            collectionId: CollectionId
          ): string =>
            `/api/thingaggregate/museum/${mid}/objects/${objectId}?collectionIds=${collectionId}`,
          getMainObject: (
            mid: MuseumId,
            objectId: ObjectId,
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
