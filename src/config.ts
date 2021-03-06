//import  { MuseumId, CollectionId, NodeId, ObjectId } from '../../types/ids';
import queryParams from './shared/queryParams';
import { AppSession } from './types/appSession';
import { Maybe } from './types/common';
import { MuseumId, CollectionId, NodeId, ObjectId } from './types/ids';
/* Old:
type AppSession = {
  museumId: number,
  collectionId: string,
  accessToken: string
};

*/
const clientContextUrl = (appSession: AppSession) => {
  console.log('Client context URL');
  return `/museum/${appSession.museumId}/collections/${appSession.collectionId}`;
};

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
  api: {
    persons: {
      editUrl: (actorUuid: string) => `/api/person/persons/${actorUuid}`,
      addUrl: '/api/person/persons',
      getUrl: (actorUuid: string) => `/api/person/persons/${actorUuid}`,
      searchUrl: (personName: string) => `/api/person/personNames?search=${personName}`,
      searchPersonBySynonymOrName: (personName: string) =>
        `/api/person/persons?search=${personName}`,
      mergeUrl: (actorUuid: string) => (actorUuidToSyn: string) =>
        `/api/person/persons/${actorUuid}/merge/${actorUuidToSyn}`,
      addPersonNameUrl: '/api/person/personnames',
      getPersonNameUrl: (actorNameUuid: string) =>
        `/api/person/personNames/${actorNameUuid}`
    },
    places: {
      addPlaceUrl: '/api/place/places',
      searchAdmPlaceURL: (searchString: string) =>
        `/api/place/admPlaces?search=${searchString}`,
      getDatumURL: '/api/place/coordinatedatums',
      getCoordinateSourceURL: '/api/place/coordinatesources',
      getCoordinateTypesURL: '/api/place/coordinatetypes',
      getCoordinateGeometriesURL: '/api/place/coordinategeometries',
      loadAdmPlaceWithType: (type: string) => `/api/place/admPlaces?type=${type}`
    },
    collectingEvent: {
      addEventUrl: '/api/event/events',
      getCollectingEventMethods: '/api/event/collectingmethods',
      getEvent: (eventUuid: string) => `/api/event/events/${eventUuid}`,
      editEvent: {
        eventPersonRevision: (eventUuid: string) =>
          `/api/event/events/${eventUuid}/personRevisions`,
        eventDateRevision: (eventUuid: string) =>
          `/api/event/events/${eventUuid}/dateRevisions`,
        eventPlaceRevision: (eventUuid: string) =>
          `/api/event/events/${eventUuid}/placeRevisions`,
        eventAttributesRevision: (eventUuid: string) =>
          `/api/event/events/${eventUuid}/attributeRevisions`
      }
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
        start: '/',
        homePage: '/home',
        aboutPage: '/about',
        person: {
          addPerson: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/person/add`,
          viewPerson: (appSession: AppSession, id: string) =>
            `${clientContextUrl(appSession)}/person/view/${id}`,
          editPerson: (appSession: AppSession, id: string) =>
            `${clientContextUrl(appSession)}/person/edit/${id}`,
          searchPerson: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/person/search`,
          addNewPersonName: (appSession: AppSession, newName: string) =>
            `${clientContextUrl(appSession)}/person/personname/add/${newName}`,
          addNewPersonNameBlank: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/person/personname/add/`
        },
        collectingEvent: {
          edit: (appSession: AppSession, id: string) =>
            `${clientContextUrl(appSession)}/collectingEvent/edit/${id}`,
          view: (appSession: AppSession, id: string) =>
            `${clientContextUrl(appSession)}/collectingEvent/view/${id}`,
          add: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/collectingEvent/add`
        },
        conservation: {
          editConservation: (appSession: AppSession, conservationId: number) =>
            `${clientContextUrl(appSession)}/conservation/edit/${conservationId}`,
          addConservation: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/conservation/add`,
          viewConservation: (appSession: AppSession, conservationId: number) =>
            `${clientContextUrl(appSession)}/conservation/${conservationId}`,
          viewConservationForExpandedSubEvent: (
            appSession: AppSession,
            conservationId: number,
            subEventId: number
          ) =>
            `${clientContextUrl(
              appSession
            )}/conservation/${conservationId}/${subEventId}`,
          baseUrl: (appSession: AppSession) =>
            `${clientContextUrl(appSession)}/conservation`
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
          goToNode: (nodeId: number, appSession: AppSession, page?: Maybe<number>) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}${page ? `/${page}` : ''}`,
          addNode: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/add`,
          editNode: (nodeId: number, appSession: AppSession) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/view`,
          goToObjects: (nodeId: string, appSession: AppSession, page?: Maybe<number>) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/objects${
              page ? `/${page}` : ''
            }`,
          goToSamples: (nodeId: string, appSession: AppSession, page?: Maybe<number>) =>
            `${clientContextUrl(appSession)}/magasin/${nodeId}/samples${
              page ? `/${page}` : ''
            }`,
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
        taxon: {
          getLatinNamesFromName: (scientificName: string) =>
            `/Api/Taxon/ScientificName?${scientificName}`,
          getSynonymsFromLatinNameId: (scientificNameId: number) =>
            `/Api/Taxon/ScientificName/${scientificNameId}`,
          getLatinNamesMatch: (scientificName: string, mid: string) =>
            `https://artsdatabanken.no/Api/Taxon/ScientificName?scientificName=${scientificName}*`,
          getLatinNamesExact: (scientificName: string, mid: string) =>
            `/Api/Taxon/ScientificName?ScientificName=${scientificName}`
        },
        conservation: {
          getConditionCodeList: `/api/management/conservation/conditionCodes`,
          getMaterialList: (mid: MuseumId, collectionId: CollectionId) =>
            `/api/management/${mid}/conservation/materials?collectionId=${collectionId}`,
          getTreatmentMaterialList: `/api/management/conservation/treatmentMaterials`,
          getKeywordList: `/api/management/conservation/treatmentKeywords`,
          getRoleList: `/api/management/conservation/roles`,
          getAllConservationTypes: (mid: MuseumId) =>
            `/api/management/${mid}/conservation/types`,
          addConservationEvent: (mid: MuseumId) =>
            `/api/management/${mid}/conservation/events`,
          getConservationById: (mid: MuseumId, conservationId: number) =>
            `/api/management/${mid}/conservation/events/${conservationId}`,
          getConservationForObject: (mid: MuseumId, id: number) =>
            `/api/management/${mid}/conservation/events/object/${id}`,
          getConservationForObjectAggregated: (mid: MuseumId, id: number) =>
            `/api/management/${mid}/conservation/conservations/object/${id}`,
          addFileUrl: (mid: MuseumId, collectionId: CollectionId, eventId: number) =>
            `/api/document/museum/${mid}/conservations/attachments?eventId=${eventId}&collectionId=${collectionId}`,
          getDeleteSubEventUrl: (mid: MuseumId, eventId: number) =>
            `/api/management/${mid}/conservation/events?eventIds=${eventId}`,
          getCurrentMeasurementDataForObject: (mid: MuseumId, id: string) =>
            `/api/management/${mid}/conservation/object/${id}/measurements`,
          getConservationReport: (
            mid: MuseumId,
            collectionId: CollectionId,
            eventId: string
          ) =>
            `/api/management/${mid}/conservation/conservationReportHTML/${eventId}?collectionId=${collectionId}`,
          search: (
            mid: MuseumId,
            collectionIds: string,
            from: number,
            limit: number,
            q: Maybe<string>
          ) =>
            `/api/management/${mid}/conservation/search` +
            queryParams({
              from,
              limit,
              collectionIds,
              q
            })
        },
        attachments: {
          getFilesUrl: (files: Array<string>, mid: MuseumId, eventId: number) =>
            `/api/document/museum/${mid}/collectionManagement/attachments?eventId=${eventId}&fileIds=${files.join(
              ','
            )}`,
          getFileUrl: (fileId: string, mid: MuseumId) =>
            `/api/document/museum/${mid}/collectionManagement/attachments/${fileId}`
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
            `/api/document/museum/${mid}/analyses/attachments?eventId=${analysisId}&collectionId=${collectionId}`,
          getFilesUrl: (files: Array<string>, mid: MuseumId, analysisId: number) =>
            `/api/document/museum/${mid}/collectionManagement/attachments?eventId=${analysisId}&fileIds=${files.join(
              ','
            )}`,
          getFileUrl: (file: string, mid: MuseumId) =>
            `/api/document/museum/${mid}/collectionManagement/attachments/${file}`,
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
            q: Maybe<string>
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
            pageNum: Maybe<number>,
            limit: Maybe<number>
          ): string =>
            `/api/storagefacility/museum/${mid}/storagenodes/${uuid}/children?page=${pageNum ||
              1}&limit=${limit || 25}`,
          currentLocation: (
            mid: MuseumId,
            objectId: string,
            objectType?: Maybe<string>
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
            museumNo: Maybe<string>,
            museumNoAsANumber: Maybe<string>,
            subNo: Maybe<string>,
            term: Maybe<string>,
            q: Maybe<string>,
            limit: number,
            from: number,
            collectionId: CollectionId,
            museumId: MuseumId,
            ignoreSamples: boolean
          ): string => {
            const baseUrl = `/api/thingaggregate/museum/${museumId}/objects/search`;
            const qs = queryParams({
              museumNo,
              museumNoAsANumber,
              subNo,
              term,
              from,
              limit,
              q,
              collectionIds: collectionId,
              ignoreSamples: ignoreSamples
            });
            return baseUrl + qs;
          },
          searchDatabaseObjectUrl: (
            museumNo: Maybe<string>,
            museumNoAsANumber: Maybe<string>,
            subNo: Maybe<string>,
            term: Maybe<string>,
            q: Maybe<string>,
            limit: number,
            from: number,
            collectionId: CollectionId,
            museumId: MuseumId,
            ignoreSamples: boolean
          ): string => {
            const baseUrl = `/api/thingaggregate/museum/${museumId}/objects/searchDb`;
            const qs = queryParams({
              museumNo,
              museumNoAsANumber,
              subNo,
              term,
              from,
              limit,
              q,
              collectionIds: collectionId,
              ignoreSamples: ignoreSamples
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
          buildInfo: '/api/auth/service/auth/buildinfo',
          rolesUrl: (
            feideEmail: string,
            mid: MuseumId,
            collectionId: CollectionId
          ): string =>
            `/api/auth/rest/${mid}/roles/${feideEmail}?collectionId=${collectionId}`
        }
      }
    }
  }
};
