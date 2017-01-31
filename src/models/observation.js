import entries from 'object.entries';
import Config from '../config';

class Observation {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Observation.loadObservations = (simpleGet) => ({ nodeId, museumId, token, callback }) => {
  return simpleGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/observations`, token, callback)
    .map(arr => {
      if (!arr) {
        return [];
      }
      return arr.map(json => new Observation(json));
    });
};

export default Observation;