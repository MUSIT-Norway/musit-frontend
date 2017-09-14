import Config from '../config';
import routes from '../routes';

describe('routes', () => {
  it('should be a function', () => {
    expect(routes()).not.toBe(null);
  });
});

const urls = Config.magasin.urls;

const appSession = {
  museumId: 99,
  collectionId: '1234',
  accessToken: '1234'
};

describe('Config urls', () => {
  const client = [
    {
      actual: urls.client.storagefacility.goToRoot(appSession),
      expected: '/museum/99/collections/1234/magasin'
    },
    {
      actual: urls.client.storagefacility.addNode(1, appSession),
      expected: '/museum/99/collections/1234/magasin/1/add'
    },
    {
      actual: urls.client.storagefacility.editNode(1, appSession),
      expected: '/museum/99/collections/1234/magasin/1/view'
    },
    {
      actual: urls.client.storagefacility.addObservation(1, appSession),
      expected: '/museum/99/collections/1234/magasin/1/observation/add'
    },
    {
      actual: urls.client.storagefacility.editObservation(1, appSession),
      expected: '/museum/99/collections/1234/magasin/1/observation/edit'
    },
    {
      actual: urls.client.storagefacility.viewObservation(1, 3, appSession),
      expected: '/museum/99/collections/1234/magasin/1/observation/3'
    },
    {
      actual: urls.client.storagefacility.addControl(1, appSession),
      expected: '/museum/99/collections/1234/magasin/1/control/add'
    },
    {
      actual: urls.client.storagefacility.viewControl(1, 3, appSession),
      expected: '/museum/99/collections/1234/magasin/1/control/3'
    },
    {
      actual: urls.client.storagefacility.viewControlsObservations(1, appSession),
      expected: '/museum/99/collections/1234/magasin/1/controlsobservations'
    },
    {
      actual: urls.client.conservation.addConservation(appSession),
      expected: '/museum/99/collections/1234/conservation/add'
    },
    {
      actual: urls.client.conservation.editConservation(appSession, 123),
      expected: '/museum/99/collections/1234/conservation/edit/123'
    },
    {
      actual: urls.client.conservation.viewConservation(appSession, 123),
      expected: '/museum/99/collections/1234/conservation/123'
    }
  ];

  const serviceEndpoints = [
    {
      service: 'storagefacility',
      endpoints: [
        {
          name: 'searchUrl',
          actual: urls.api.storagefacility.searchUrl('Øne', 99),
          expected:
            '/api/storagefacility/museum/99/storagenodes/search?searchStr=%C3%98ne&'
        },
        {
          name: 'scanUrl',
          actual: urls.api.storagefacility.scanUrl('0000-0000', 99),
          expected:
            '/api/storagefacility/museum/99/storagenodes/scan?storageNodeId=0000-0000&'
        },
        {
          name: 'scanOldUrl',
          actual: urls.api.storagefacility.scanOldUrl(1234, 99),
          expected: '/api/storagefacility/museum/99/storagenodes/scan?oldBarcode=1234'
        },
        {
          name: 'rootNodeUrl',
          actual: urls.api.storagefacility.rootNodeUrl(99),
          expected: '/api/storagefacility/museum/99/storagenodes/root'
        },
        {
          name: 'nodeUrl',
          actual: urls.api.storagefacility.nodeUrl(
            99,
            'ac08361b-3f13-4cde-9428-4ba2776316bd'
          ),
          expected:
            '/api/storagefacility/museum/99/storagenodes/ac08361b-3f13-4cde-9428-4ba2776316bd'
        },
        {
          name: 'childrenNodesUrl_with_page_and_limit',
          actual: urls.api.storagefacility.childrenNodesUrl(
            99,
            'ac08361b-3f13-4cde-9428-4ba2776316bd',
            4,
            10
          ),
          expected:
            '/api/storagefacility/museum/99/storagenodes/ac08361b-3f13-4cde-9428-4ba2776316bd/children?page=4&limit=10'
        },
        {
          name: 'childrenNodesUrl_without_page_and_limit',
          actual: urls.api.storagefacility.childrenNodesUrl(
            99,
            'ac08361b-3f13-4cde-9428-4ba2776316bd'
          ),
          expected:
            '/api/storagefacility/museum/99/storagenodes/ac08361b-3f13-4cde-9428-4ba2776316bd/children?page=1&limit=25'
        },
        {
          name: 'currentLocation',
          actual: urls.api.storagefacility.currentLocation(99, 123),
          expected:
            '/api/storagefacility/museum/99/storagenodes/objects/123/currentlocation?objectType=collection'
        },
        {
          name: 'currentLocations',
          actual: urls.api.storagefacility.currentLocations(99),
          expected: '/api/storagefacility/museum/99/storagenodes/objects/currentlocations'
        },
        {
          name: 'moveNodeUrl',
          actual: urls.api.storagefacility.moveNodeUrl(99),
          expected: '/api/storagefacility/museum/99/storagenodes/moveNode'
        },
        {
          name: 'objectLocations',
          actual: urls.api.storagefacility.objectLocations(99, 123),
          expected: '/api/storagefacility/museum/99/storagenodes/objects/123/locations'
        }
      ]
    },
    {
      service: 'auth',
      endpoints: [
        {
          name: 'groupsUrl',
          actual: urls.api.auth.groupsUrl('someUser@feide.no'),
          expected: '/api/auth/rest/groups/someUser@feide.no'
        }
      ]
    },

    {
      service: 'actor',
      endpoints: [
        {
          name: 'searchUrl',
          actual: urls.api.actor.searchUrl('Øne', 99),
          expected: '/api/actor/person?museumId=99&search=[%C3%98ne]'
        }
      ]
    },
    {
      service: 'geolocation',
      endpoints: [
        {
          name: 'searchUrl',
          actual: urls.api.geolocation.searchUrl('Øne'),
          expected: '/api/geolocation/address?search=[%C3%98ne]'
        }
      ]
    },
    {
      service: 'thingaggregate',
      endpoints: [
        {
          name: 'scanOldUrl',
          actual: urls.api.thingaggregate.scanOldUrl(1234, 99, '1234'),
          expected:
            '/api/thingaggregate/museum/99/scan?oldBarcode=1234&collectionIds=1234'
        },
        {
          name: 'getMainObject',
          actual: urls.api.thingaggregate.getMainObject(99, 2344, '1234'),
          expected:
            '/api/thingaggregate/museum/99/objects/2344/children?collectionIds=1234'
        },
        {
          name: 'getObjectForCollection',
          actual: urls.api.thingaggregate.getObjectForCollection(99, 433, '1234', 1, 20),
          expected:
            '/api/thingaggregate/museum/99/node/433/objects?collectionIds=1234&page=1&limit=20'
        },
        {
          name: 'nodeStatsUrl',
          actual: urls.api.thingaggregate.nodeStatsUrl(
            99,
            'ac08361b-3f13-4cde-9428-4ba2776316bd'
          ),
          expected:
            '/api/thingaggregate/museum/99/storagenodes/ac08361b-3f13-4cde-9428-4ba2776316bd/stats'
        }
      ]
    },
    {
      service: 'managment',
      endpoints: [
        {
          name: 'addConservationEvent',
          actual: urls.api.conservation.addConservationEvent(99),
          expected: '/api/management/99/conservation'
        },
        {
          name: 'getConservationById',
          actual: urls.api.conservation.getConservationById(99, 123),
          expected: '/api/management/99/conservation/123'
        },
        {
          name: 'getAllAnalysisTypes',
          actual: urls.api.analysisType.getAllAnalysisTypes(99),
          expected: '/api/management/99/analyses/types'
        },
        {
          name: 'getAnalysisCategories',
          actual: urls.api.analysisType.getAnalysisCategories(99),
          expected: '/api/management/99/analyses/categories'
        },
        {
          name: 'getAnalysisTypesForCategory',
          actual: urls.api.analysisType.getAnalysisTypesForCategory(99, 123),
          expected: '/api/management/99/analyses/types/categories/123'
        },
        {
          name: 'getAnalysisTypesForCollection',
          actual: urls.api.analysisType.getAnalysisTypesForCollection(99, 123),
          expected: '/api/management/99/analyses/types?collectionIds=123'
        },
        {
          name: 'resultsUrl',
          actual: urls.api.analysis.resultsUrl(99, 123),
          expected: '/api/management/99/analyses/123/results'
        },
        {
          name: 'saveAnalysisEvent',
          actual: urls.api.analysis.saveAnalysisEvent(99),
          expected: '/api/management/99/analyses'
        },
        {
          name: 'getAnalysisById',
          actual: urls.api.analysis.getAnalysisById(99, 123),
          expected: '/api/management/99/analyses/123'
        },
        {
          name: 'getChildAnalyses',
          actual: urls.api.analysis.getChildAnalyses(99, 123),
          expected: '/api/management/99/analyses/123/children'
        },
        {
          name: 'saveResult',
          actual: urls.api.analysis.saveResult(99, 123),
          expected: '/api/management/99/analyses/123/results'
        },
        {
          name: 'importResults',
          actual: urls.api.analysis.importResults(99, 123),
          expected: '/api/management/99/analyses/123/results/import'
        },
        {
          name: 'getAnalysisForObject',
          actual: urls.api.analysis.getAnalysisForObject(99, 123),
          expected: '/api/management/99/analyses/objects/123'
        },
        {
          name: 'analysesForObject',
          actual: urls.api.analysis.analysesForObject(99, 123),
          expected: '/api/management/99/analyses/objects/123'
        },
        {
          name: 'getPurposes',
          actual: urls.api.analysis.getPurposes,
          expected: '/api/management/purposes'
        },
        {
          name: 'getAnalysisEvents',
          actual: urls.api.analysis.getAnalysisEvents(99, ['col1', 'col2']),
          expected: '/api/management/99/analyses?collectionIds=col1,col2'
        },
        {
          name: 'baseUrl',
          actual: urls.api.samples.baseUrl(99),
          expected: '/api/management/99/samples'
        },
        {
          name: 'sampleTypes',
          actual: urls.api.samples.sampleTypes,
          expected: '/api/management/sampletypes'
        },
        {
          name: 'childrenSamples',
          actual: urls.api.samples.childrenSamples(99, 123),
          expected: '/api/management/99/samples/123/children'
        },
        {
          name: 'originatedFromObject',
          actual: urls.api.samples.originatedFromObject(99, 123),
          expected: '/api/management/99/samples/123/all'
        },
        {
          name: 'treatments',
          actual: urls.api.samples.treatments,
          expected: '/api/management/treatments'
        },
        {
          name: 'storagecontainer',
          actual: urls.api.samples.storagecontainer,
          expected: '/api/management/storagecontainer'
        },
        {
          name: 'storagemediums',
          actual: urls.api.samples.storagemediums,
          expected: '/api/management/storagemediums'
        },
        {
          name: 'samplesForNode',
          actual: urls.api.samples.samplesForNode(
            99,
            'dca44956-40d0-48dc-bd0d-921b825ad019',
            'dca44956-40d0-48dc-bd0d-921b825ad000'
          ),
          expected:
            '/api/management/99/node/dca44956-40d0-48dc-bd0d-921b825ad019/' +
            'samples?collectionIds=dca44956-40d0-48dc-bd0d-921b825ad000'
        },
        {
          name: 'about',
          actual: urls.client.aboutPage,
          expected: '/about'
        },
        {
          name: 'home',
          actual: urls.client.homePage,
          expected: '/home'
        }
      ]
    }
  ];

  it('should have working client paths', () => {
    client.forEach(test => expect(test.actual).toEqual(test.expected));
  });

  serviceEndpoints.forEach(se =>
    describe(`Service api ${se.service}`, () => {
      se.endpoints.forEach(t => {
        it(t.name, () => {
          expect(t.actual).toEqual(t.expected);
        });
      });
    })
  );
});
