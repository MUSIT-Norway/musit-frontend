import Config from '../config';
import MuseumId from '../shared/models/museumId';

describe('Config urls', () => {
  it('storagefacility searchUrl', () => {
    const url = Config.magasin.urls.storagefacility.searchUrl('Øne', new MuseumId(99));
    expect(url).toEqual('/api/storagefacility/v1/museum/99/storagenodes/search?searchStr=%C3%98ne&');
  });

  it('actor searchUrl', () => {
    const url = Config.magasin.urls.actor.searchUrl('Øne', new MuseumId(99));
    expect(url).toEqual('/api/actor/v1/person?museumId=99&search=[%C3%98ne]');
  });

  it('geolocation searchUrl', () => {
    const url = Config.magasin.urls.geolocation.searchUrl('Øne');
    expect(url).toEqual('/api/geolocation/v1/address?search=[%C3%98ne]');
  });
});