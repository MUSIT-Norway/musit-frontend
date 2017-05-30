// @flow
import { simpleGet, simplePut, simplePost } from '../shared/RxAjax';
import Config from '../config';
import { getPath } from '../shared/util';
import type { MovableObject } from './types/movableObject';
import type { Callback, AjaxGet, AjaxPost, AjaxPut } from './types/ajax';
import type { ObjectData } from '../types/object';
import { Observable, Subject } from 'rxjs';
import type { Breadcrumb } from './types/breadcrumb';
type MuseumId = number;

class MusitObject {
  static getObjectDescription: (object: ObjectData) => string;
  static isMainObject: (object: ObjectData) => boolean;
  static getObjectDetails: (
    ajaxGet: AjaxGet
  ) => (props: {
    id: number,
    museumId: number,
    collectionId: string,
    token: string,
    callBack?: ?Callback
  }) => Observable;
  static moveObjects: (
    props: {
      object: ObjectData,
      destination: number,
      doneBy: string,
      museumId: number,
      collectionId: string,
      token: string,
      callBack: Callback
    },
    ajaxGet: AjaxGet,
    ajaxPut: AjaxPut
  ) => Observable;
  static getObjectLocations: (
    ajaxPost: AjaxPost
  ) => (props: {
    movableObjects: Array<MovableObject>,
    museumId: MuseumId,
    token: string,
    callBack: ?any
  }) => Observable;
  static getObjectLocation: (
    ajaxGet: AjaxGet
  ) => (props: {
    objectId: number,
    museumId: number,
    token: string,
    callBack?: ?Callback
  }) => Observable;
  static getMainObject: (
    ajaxGet: AjaxGet
  ) => (props: {
    id: string,
    museumId: number,
    collectionId: string,
    token: string,
    callBack?: ?Callback
  }) => Observable;
  static pickObject: (
    pickObject$: Subject,
    ajaxGet: AjaxGet
  ) => (props: {
    object: ObjectData,
    breadcrumb: Array<Breadcrumb>,
    museumId: number,
    collectionId: string,
    token: string,
    callBack?: ?Callback
  }) => Observable;
  static getObjects: (
    ajaxGet: AjaxGet
  ) => (props: {
    id: number,
    page: number,
    museumId: number,
    collectionId: string,
    token: string,
    callBack?: ?Callback
  }) => Observable;
  static moveSingleObject: (
    ajaxPut: AjaxPut
  ) => (props: {
    id: string,
    destination: number,
    doneBy: string,
    objectType?: 'collection' | 'sample',
    museumId: number,
    token: string,
    callBack?: ?Callback
  }) => Observable;
  static getLocationHistory: (
    ajaxGet: AjaxGet
  ) => (props: {
    objectId: number,
    museumId: number,
    token: string,
    callBack?: ?Callback
  }) => Observable;
  static findByBarcode: (
    ajaxGet: AjaxGet
  ) => (props: {
    barcode: number,
    museumId: number,
    collectionId: string,
    token: string
  }) => Observable;
  static searchForObjects: (
    ajaxGet: AjaxGet
  ) => (props: {
    museumNo: string,
    subNo: string,
    term: string,
    perPage: number,
    page: number,
    museumId: number,
    collectionId: string,
    token: string,
    callBack?: ?Callback
  }) => Observable;
}

MusitObject.getObjectDescription = obj => {
  let objStr = obj.museumNo ? `${obj.museumNo}` : '';
  objStr = obj.subNo ? `${objStr} - ${obj.subNo}` : objStr;
  objStr = obj.term ? `${objStr} - ${obj.term}` : objStr;
  return objStr;
};

MusitObject.isMainObject = obj => obj.id === obj.mainObjectId;

MusitObject.moveObjects = (
  { object, destination, doneBy, museumId, collectionId, token, callBack },
  ajaxGet = simpleGet,
  ajaxPut = simplePut
) => {
  if (MusitObject.isMainObject(object)) {
    MusitObject.getMainObject(ajaxGet)({
      id: object.nodeId,
      museumId,
      collectionId,
      token,
      callBack: { onFailure: callBack.onFailure }
    })
      .toPromise()
      .then(objects =>
        objects.forEach(obj =>
          MusitObject.moveSingleObject(ajaxPut)({
            id: obj.id,
            destination,
            doneBy,
            museumId,
            token,
            callBack: MusitObject.isMainObject(obj) ? callBack : null
          }).toPromise()
        )
      );
  } else {
    MusitObject.moveSingleObject(ajaxPut)({
      id: object.uuid,
      destination,
      doneBy,
      museumId,
      token,
      callBack
    }).toPromise();
  }
};

MusitObject.getObjectLocations = (ajaxPost = simplePost) => ({
  movableObjects,
  museumId,
  token,
  callBack
}) =>
  ajaxPost(
    Config.magasin.urls.api.storagefacility.currentLocations(museumId),
    movableObjects,
    token,
    callBack
  ).map(({ response }) =>
    movableObjects.map(o => ({ objectId: o.id, ...response[0].node }))
  );

MusitObject.getObjectLocation = (ajaxGet = simpleGet) => ({
  objectId,
  museumId,
  token,
  callBack
}) =>
  ajaxGet(
    Config.magasin.urls.api.storagefacility.currentLocation(museumId, objectId),
    token,
    callBack
  ).map(({ response }) => ({ ...response, breadcrumb: getPath(response) }));

MusitObject.getMainObject = (ajaxGet = simpleGet) => ({
  id,
  museumId,
  collectionId,
  token,
  callBack
}) => {
  return ajaxGet(
    Config.magasin.urls.api.thingaggregate.getMainObject(museumId, id, collectionId),
    token,
    callBack
  ).map(({ response }) => response);
};

MusitObject.getObjectDetails = (ajaxGet = simpleGet) => ({
  id,
  museumId,
  collectionId,
  token,
  callBack
}) => {
  const url = Config.magasin.urls.api.thingaggregate.objectDetailsUrl(
    museumId,
    id,
    collectionId
  );
  return ajaxGet(url, token, callBack).map(({ response }) => response);
};

MusitObject.getObjects = (ajaxGet = simpleGet) => ({
  id,
  page,
  museumId,
  collectionId,
  token,
  callBack
}) => {
  const url = Config.magasin.urls.api.thingaggregate.getObjectForCollection(
    museumId,
    id,
    collectionId,
    page || 1,
    Config.magasin.limit
  );
  return ajaxGet(url, token, callBack).map(({ response }) => {
    if (!response || !response.matches) {
      return { ...response, matches: [], error: 'no response body' };
    }
    return {
      ...response,
      matches: response.matches
    };
  });
};

MusitObject.moveSingleObject = (ajaxPut = simplePut) => ({
  id,
  destination,
  doneBy,
  objectType,
  museumId,
  token,
  callBack
}) => {
  const items = [].concat(id).map(objectId => ({
    id: objectId,
    objectType: objectType || 'collection'
  }));
  const data = { doneBy, destination, items };
  return ajaxPut(
    Config.magasin.urls.api.storagefacility.moveObject(museumId),
    data,
    token,
    callBack
  );
};

MusitObject.getLocationHistory = (ajaxGet = simpleGet) => ({
  objectId,
  museumId,
  token,
  callBack
}) => {
  return ajaxGet(
    Config.magasin.urls.api.storagefacility.objectLocations(museumId, objectId),
    token,
    callBack
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

MusitObject.pickObject = (pickObject$, ajaxGet = simpleGet) => props => {
  if (MusitObject.isMainObject(props.object)) {
    MusitObject.getMainObject(ajaxGet)({ ...props, id: props.object.uuid })
      .toPromise()
      .then(objects =>
        objects.forEach(obj => pickObject$.next({ value: obj, path: props.breadcrumb }))
      );
  } else {
    pickObject$.next({ value: props.object, path: props.breadcrumb });
  }
};

MusitObject.findByBarcode = (ajaxGet = simpleGet) => ({
  barcode,
  museumId,
  collectionId,
  token
}) =>
  ajaxGet(
    Config.magasin.urls.api.thingaggregate.scanOldUrl(barcode, museumId, collectionId),
    token
  ).map(({ response }) => response);

MusitObject.searchForObjects = (ajaxGet = simpleGet) => ({
  museumNo,
  subNo,
  term,
  perPage,
  page,
  museumId,
  collectionId,
  token,
  callBack
}) => {
  const url = Config.magasin.urls.api.thingaggregate.searchObjectUrl(
    museumNo,
    subNo,
    term,
    perPage,
    page,
    collectionId,
    museumId
  );
  return ajaxGet(url, token, callBack).map(({ response }) => response).map(data => {
    if (!data || !data.matches) {
      return { ...data, matches: [], totalMatches: 0, error: 'no response body' };
    }
    return {
      ...data,
      matches: data.matches.map(m => ({ ...m, breadcrumb: getPath(m) }))
    };
  });
};

export default MusitObject;
