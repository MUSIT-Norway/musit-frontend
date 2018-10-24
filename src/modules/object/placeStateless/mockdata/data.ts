import { AdmPlace } from '../CollectionEvents';

export const admPlaces: Array<AdmPlace> = [
  {
    admPlaceId: 1,
    name: 'Oslo',
    type: 'Kommune',
    kommune: 'Oslo',
    fylke: 'Oslo fylke',
    land: 'Norge',
    lat: 59.8939224,
    long: 10.7149059,
    zoom: 12
  },
  {
    admPlaceId: 2,
    name: 'Bergen',
    type: 'Kommune',
    overordnet: 'Hordaland',
    kommune: 'Bergen',
    fylke: 'Hordaland',
    land: 'Norge',
    lat: 60.3651115,
    long: 5.2887477,
    zoom: 11
  },
  {
    admPlaceId: 3,
    name: 'Trondheim',
    type: 'Kommune',
    overordnet: 'Trøndelag',
    kommune: 'Trondheim',
    fylke: 'Trøndelag',
    land: 'Norge',
    lat: 63.418719,
    long: 10.3685518,
    zoom: 12
  },
  {
    admPlaceId: 4,
    name: 'Kristiansand',
    type: 'Kommune',
    overordnet: 'Aust-Agder',
    kommune: 'Kristiansand',
    fylke: 'Aust-Agder',
    land: 'Norge',
    lat: 58.1529583,
    long: 7.9390013,
    zoom: 12
  },
  {
    admPlaceId: 5,
    name: 'Drammen',
    type: 'Kommune',
    overordnet: 'Buskerud',
    kommune: 'Drammen',
    fylke: 'Buskerud',
    land: 'Norge',
    lat: 59.734017,
    long: 10.1489475,
    zoom: 12
  },
  {
    admPlaceId: 6,
    name: 'Buskerud',
    type: 'Fylke',
    overordnet: 'Norge',
    fylke: 'Buskerud',
    land: 'Norge',
    lat: 60,
    long: 9,
    zoom: 12
  }
];
export const coordinateTypes = ['MGRS', 'Lat / Long', 'UTM'];
export const datumValues = ['WGS84', 'ED50', 'EUREF-89'];
export const geometryTypes = ['Point', 'Reactangle', 'Polygone', 'Line'];
export const coordinateSources = ['Original label', 'GPS', 'Map', 'Other (see note)'];
export const altDepthUnits = ['Meters', 'Feet'];
