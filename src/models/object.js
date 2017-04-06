import { simpleGet, simplePut, simplePost } from '../shared/RxAjax';
import Config from '../config';
import { getPath } from '../shared/util';
import flatMap from 'lodash/flatMap';
import type { MovableObject } from './types/movableObject';
import MuseumId from './museumId';

class MusitObject {}

MusitObject.getObjectDescription = obj => {
  let objStr = obj.museumNo ? `${obj.museumNo}` : '';
  objStr = obj.subNo ? `${objStr} - ${obj.subNo}` : objStr;
  objStr = obj.term ? `${objStr} - ${obj.term}` : objStr;
  return objStr;
};

MusitObject.isMainObject = obj => obj.id === obj.mainObjectId;

MusitObject.moveObjects = (
  { object, destination, doneBy, museumId, collectionId, token, callback }
) => {
  if (MusitObject.isMainObject(object)) {
    MusitObject.getMainObject()({
      id: object.id,
      museumId,
      collectionId,
      token,
      callback: { onFailure: callback.onFailure }
    })
      .toPromise()
      .then(objects =>
        objects.forEach(obj =>
          MusitObject.moveSingleObject()({
            id: obj.id,
            destination,
            doneBy,
            museumId,
            token,
            callback: MusitObject.isMainObject(obj) ? callback : null
          }).toPromise()));
  } else {
    MusitObject.moveSingleObject()({
      id: object.id,
      destination,
      doneBy,
      museumId,
      token,
      callback
    }).toPromise();
  }
};

// Object types
// [
MusitObject.COLLECTION_OBJECT = 'collection';
MusitObject.SAMPLE_OBJECT = 'sample';
// ]

MusitObject.getObjectLocations = (ajaxPost = simplePost) =>
  (
    obs: {
      movableObjects: Array<MovableObject>,
      museumId: MuseumId,
      token: string,
      callback: ?any
    }
  ) =>
    ajaxPost(
      Config.magasin.urls.api.storagefacility.currentLocations(obs.museumId),
      obs.movableObjects,
      obs.token,
      obs.callback
    ).map(({ response }) =>
      flatMap(response, ls => ls.objectIds.map(objectId => ({ objectId, ...ls.node }))));

MusitObject.getObjectLocation = (ajaxGet = simpleGet) =>
  ({ objectId, museumId, token, callback }) =>
    ajaxGet(
      Config.magasin.urls.api.storagefacility.currentLocation(museumId, objectId),
      token,
      callback
    ).map(({ response }) => ({ ...response, breadcrumb: getPath(response) }));

MusitObject.getMainObject = (ajaxGet = simpleGet) =>
  ({ id, museumId, collectionId, token, callback }) => {
    return ajaxGet(
      Config.magasin.urls.api.thingaggregate.getMainObject(museumId, id, collectionId),
      token,
      callback
    ).map(({ response }) => response);
  };

MusitObject.getObjectDetails = (ajaxGet = simpleGet) =>
  ({ id, museumId, collectionId, token, callback }) => {
    const url = Config.magasin.urls.api.thingaggregate.objectDetailsUrl(
      museumId,
      id,
      collectionId
    );
    return ajaxGet(url, token, callback).map(({ response }) => response);
  };

MusitObject.getObjects = (ajaxGet = simpleGet) =>
  ({ id, page, museumId, collectionId, token, callback }) => {
    const url = Config.magasin.urls.api.thingaggregate.getObjectForCollection(
      museumId,
      id,
      collectionId,
      page || 1,
      Config.magasin.limit
    );
    return ajaxGet(url, token, callback).map(({ response }) => {
      if (!response || !response.matches) {
        return { ...response, matches: [], error: 'no response body' };
      }
      return {
        ...response,
        matches: response.matches
      };
    });
  };

MusitObject.moveSingleObject = (ajaxPut = simplePut) =>
  (
    {
      id,
      destination,
      doneBy,
      objectType = MusitObject.COLLECTION_OBJECT,
      museumId,
      token,
      callback
    }
  ) => {
    const items = [].concat(id).map(objectId => ({ id: objectId, objectType }));
    const data = { doneBy, destination, items };
    return ajaxPut(
      Config.magasin.urls.api.storagefacility.moveObject(museumId),
      data,
      token,
      callback
    );
  };

MusitObject.getLocationHistory = (ajaxGet = simpleGet) =>
  ({ objectId, museumId, token, callback }) => {
    return ajaxGet(
      Config.magasin.urls.api.storagefacility.objectLocations(museumId, objectId),
      token,
      callback
    ).map(({ response }) => {
      if (!Array.isArray(response)) {
        return [];
      }
      return response.map(data => {
        return {
          ...data,
          from: {
            ...data.from,
            breadcrumb: getPath(data.from)
          },
          to: {
            ...data.to,
            breadcrumb: getPath(data.to)
          }
        };
      });
    });
  };

MusitObject.pickObject = (pickObject$, ajaxGet = simpleGet) =>
  props => {
    if (MusitObject.isMainObject(props.object)) {
      MusitObject.getMainObject(ajaxGet)({ ...props, id: props.object.id })
        .toPromise()
        .then(objects =>
          objects.forEach(obj =>
            pickObject$.next({ value: obj, path: props.breadcrumb })));
    } else {
      pickObject$.next({ value: props.object, path: props.breadcrumb });
    }
  };

MusitObject.findByBarcode = (ajaxGet = simpleGet) =>
  ({ barcode, museumId, collectionId, token }) =>
    ajaxGet(
      Config.magasin.urls.api.thingaggregate.scanOldUrl(barcode, museumId, collectionId),
      token
    ).map(({ response }) => response);

MusitObject.searchForObjects = (ajaxGet = simpleGet) =>
  ({ museumNo, subNo, term, perPage, page, museumId, collectionId, token, callback }) => {
    const url = Config.magasin.urls.api.thingaggregate.searchObjectUrl(
      museumNo,
      subNo,
      term,
      perPage,
      page,
      collectionId,
      museumId
    );
    return ajaxGet(url, token, callback).map(({ response }) => response).map(data => {
      if (!data || !data.matches) {
        return { ...data, matches: [], totalMatches: 0, error: 'no response body' };
      }
      return {
        ...data,
        matches: data.matches.map(m => ({...m, breadcrumb: getPath(m)}))
      };
    });
  };

export default MusitObject;
