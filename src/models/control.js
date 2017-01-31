import entries from 'object.entries';
import { simpleGet } from '../shared/RxAjax';
import Config from '../config';

class Control {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Control.loadControls = ({ nodeId, museumId, token, callback }) => {
  return simpleGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/controls`, token, callback)
    .map(arr => {
      if (!arr) {
        return [];
      }
      return arr.map(json => new Control(json));
    });
};

export default Control;