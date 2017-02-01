import entries from 'object.entries';
import Config from '../config';

class Observation {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Observation.loadObservations = (ajaxGet) => ({ nodeId, museumId, token, callback }) => {
  return ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/observations`, token, callback)
    .map(arr => {
      if (!arr) {
        return [];
      }
      return arr.map(json => new Observation(json));
    });
};

export default Observation;