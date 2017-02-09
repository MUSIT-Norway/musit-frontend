import entries from 'object.entries';
import Config from '../config';
import { mapToBackend } from './mapper/control/to_backend';
import { simplePost, simpleGet } from '../shared/RxAjax';
import MusitActor from './actor'

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

Control.addControl = ({ nodeId, controlData, observations, museumId, token, callback }) => {
  const data = mapToBackend(controlData, observations, nodeId);
  const url = `${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/controls`;
  return simplePost(url, data, token, callback)
    .toPromise();
};

Control.getControl = (ajaxGet) => (nodeId, controlId, museumId, token, callback) => {
  const url = `${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/controls/${controlId}`;
  console.log(url);
  return ajaxGet(url, token, callback)
    .map(({ response }) => response)
    .map(data => {
      if (!data) {
        return {...data, error: 'no response body'};
      }
      return data;
    });
};

Control.getControl2 = (ajaxGet) => (nodeId, controlId, museumId, token, callback) => {
  const url = `${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/controls/${controlId}`;
  console.log(url);
  return ajaxGet(url, token, callback)
    .flatMap(control => {
      const actorIds = uniq([control.response.doneBy, control.response.registeredBy]).filter(a => a);
      return MusitActor.getActorDetails(ajaxPost)(actorIds, token)
    })
    .map(({ response }) => response)
    .map(data => {
      if (!data) {
        return {...data, error: 'no response body'};
      }
      return data;
    });
};


export default Control;