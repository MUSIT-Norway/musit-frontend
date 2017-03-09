import Config from '../config';
import MuseumId from '../models/museumId';
import routes from '../routes';

describe('routes', () => {
  it('should be a function', () => {
    expect(routes()).not.toBe(null);
  });
});

describe('Config urls', () => {
  it('storagefacility searchUrl', () => {
    const url = Config.magasin.urls.api.storagefacility.searchUrl('Øne', new MuseumId(99));
    expect(url).toEqual('/api/storagefacility/v1/museum/99/storagenodes/search?searchStr=%C3%98ne&');
  });

  it('actor searchUrl', () => {
    const url = Config.magasin.urls.api.actor.searchUrl('Øne', new MuseumId(99));
    expect(url).toEqual('/api/actor/v1/person?museumId=99&search=[%C3%98ne]');
  });

  it('geolocation searchUrl', () => {
    const url = Config.magasin.urls.api.geolocation.searchUrl('Øne');
    expect(url).toEqual('/api/geolocation/v1/address?search=[%C3%98ne]');
  });
});