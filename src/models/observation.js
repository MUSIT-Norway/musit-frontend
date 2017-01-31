import entries from 'object.entries';
import { simpleGet } from '../shared/RxAjax';
import Config from '../config';

class Observation {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Observation.loadObservations = ({ nodeId, museumId, token, callback }) => {
  return simpleGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/observations`, token, callback)
    .map(json => new Observation(json));
};

export default Observation;