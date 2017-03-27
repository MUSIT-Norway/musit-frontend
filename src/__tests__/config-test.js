import Config from '../config';
import MuseumId from '../models/museumId';
import CollectionId from '../models/collectionId';
import routes from '../routes';
import { AppSession } from '../modules/app/appSession';

describe('routes', () => {
  it('should be a function', () => {
    expect(routes()).not.toBe(null);
  });
});

const urls = Config.magasin.urls;

const appSession = new AppSession({ museumId: new MuseumId(99), collectionId: new CollectionId('1234'), accessToken: '1234'});

describe('Config urls', () => {

  const data = [
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
      actual: urls.api.auth.groupsUrl('someUser@feide.no'),
      expected: '/api/auth/rest/groups/someUser@feide.no'
    },
    {
      actual: urls.api.storagefacility.searchUrl('Øne', new MuseumId(99)),
      expected: '/api/storagefacility/museum/99/storagenodes/search?searchStr=%C3%98ne&'
    },
    {
      actual: urls.api.actor.searchUrl('Øne', new MuseumId(99)),
      expected: '/api/actor/person?museumId=99&search=[%C3%98ne]'
    },
    {
      actual: urls.api.geolocation.searchUrl('Øne'),
      expected: '/api/geolocation/address?search=[%C3%98ne]'
    },
    {
      actual: urls.api.storagefacility.scanUrl('0000-0000', new MuseumId(99)),
      expected: '/api/storagefacility/museum/99/storagenodes/scan?storageNodeId=0000-0000&'
    },
    {
      actual: urls.api.storagefacility.scanOldUrl(1234, new MuseumId(99)),
      expected: '/api/storagefacility/museum/99/storagenodes/scan?oldBarcode=1234'
    },
    {
      actual: urls.api.thingaggregate.scanOldUrl(1234, new MuseumId(99), new CollectionId('1234')),
      expected: '/api/thingaggregate/museum/99/scan?oldBarcode=1234&collectionIds=1234'
    }
  ];

  it('should have working urls', () => {
    data.forEach((test) => expect(test.actual).toEqual(test.expected));
  });
});