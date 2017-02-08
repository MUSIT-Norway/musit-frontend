import entries from 'object.entries';
import Config from '../config';
import { mapToBackend } from './mapper/control/to_backend';
import { simplePost, simpleGet } from '../shared/RxAjax';

class Control {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Control.loadControls = (ajaxGet =  simpleGet) => ({ nodeId, museumId, token, callback }) => {
  return ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/controls`, token, callback)
    .map(({ response }) => response)
    .map(arr => {
      if (!arr) {
        return [];
      }
      return arr.map(json => new Control(json));
    });
};

Control.addControl = (ajaxPost = simplePost) => ({ nodeId, controlData, observations, museumId, token, callback }) => {
  const data = mapToBackend(controlData, observations, nodeId);
  const url = `${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/controls`;
  return ajaxPost(url, data, token, callback);
};

export default Control;