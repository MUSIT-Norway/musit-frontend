import entries from 'object.entries';
import Config from '../config';
import { mapToBackend } from './mapper/control/to_backend';
import { simplePost, simpleGet } from '../shared/RxAjax';
import MusitActor from './actor';
import uniq from 'lodash/uniq';

class Control {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Control.loadControls = (ajaxGet = simpleGet) =>
  ({ nodeId, museumId, token, callback }) => {
    return ajaxGet(
      `${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/${nodeId}/controls`,
      token,
      callback
    )
      .map(({ response }) => response)
      .map(arr => {
        if (!arr) {
          return [];
        }
        return arr.map(json => new Control(json));
      });
  };

Control.addControl = (ajaxPost = simplePost) =>
  ({ nodeId, controlData, observations, museumId, token, callback }) => {
    const data = mapToBackend(controlData, observations, nodeId);
    const url = `${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/${nodeId}/controls`;
    return ajaxPost(url, data, token, callback);
  };

Control.getControl = (ajaxGet = simpleGet, ajaxPost = simplePost) =>
  ({ nodeId, controlId, museumId, token, callback }) => {
    const url = `${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/${nodeId}/controls/${controlId}`;
    return ajaxGet(url, token, callback).flatMap(control => {
      if (!control.response) {
        return { error: 'no response body' };
      }
      const actorIds = uniq([
        control.response.doneBy,
        control.response.registeredBy
      ]).filter(p => p);
      return MusitActor.getActors(ajaxPost)(actorIds, token).map(
        actorDetails =>
          new Control({
            ...control.response,
            ...MusitActor.getActorNames(
              actorDetails,
              control.response.doneBy,
              control.response.registeredBy
            )
          })
      );
    });
  };

export default Control;
