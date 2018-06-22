// @flow
import { simpleGet, simplePut, simplePost } from '../shared/RxAjax';
import Config from '../config';
import { getPath } from '../shared/util';
import { MovableObject } from './types/movableObject';
import { objectTypeAndId } from '../types/object';
import { Callback, AjaxGet, AjaxPost, AjaxPut } from '../types/ajax';
import { ObjectData } from '../types/object';
import { Observable, Subject } from 'rxjs';
import { Breadcrumb } from './types/breadcrumb';
import { Star, Maybe, TODO } from '../types/common';

type MuseumId = number;

class MusitObject {
  static getObjectDescription: (object: ObjectData) => string;
  static isMainObject: (object: ObjectData) => boolean;
  static getObjectDetails: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      id: string;
      museumId: number;
      collectionId: string;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Star>;
  static moveObjects: (
    props: {
      object: ObjectData;
      destination: number;
      doneBy: string;
      museumId: number;
      collectionId: string;
      token: string;
      callback?: Callback<Star>;
    },
    ajaxGet?: AjaxGet<Star>,
    ajaxPut?: AjaxPut<Star>
  ) => void;
  static getObjectLocations: (
    ajaxPost?: AjaxPost<Star>
  ) => (
    props: {
      movableObjects: Array<MovableObject>;
      museumId: MuseumId;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Star>;
  static getObjectLocation: (
    ajaxGet?: AjaxGet<Star>
  ) => (
    props: {
      objectId: string;
      objectType?: Maybe<string>;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Star>;
  static getMainObject: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      id: string;
      museumId: number;
      collectionId: string;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Star>;
  static getObjectWithCurrentLocation: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      objectId: string;
      museumId: number;
      collectionId: string;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<ObjectData>;

  static pickObject: (
    pickObject$: Subject<Star>,
    ajaxGet?: AjaxGet<Star>
  ) => (
    props: {
      object: ObjectData;
      breadcrumb: Array<Breadcrumb>;
      museumId: number;
      collectionId: string;
      token: string;
      callback?: Callback<Star>;
    }
  ) => void;
  static getObjects: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      id: string;
      page: number;
      museumId: number;
      collectionId: string;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Array<ObjectData>>;
  static moveSingleObject: (
    ajaxPut?: AjaxPut<Star>
  ) => (
    props: {
      destination: number;
      doneBy: string;
      objectTypeAndId?: objectTypeAndId;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Star>;
  static getLocationHistory: (
    ajaxGet?: AjaxGet<Star>
  ) => (
    props: {
      objectId: number;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Star>;
  static findByBarcode: (
    ajaxGet?: AjaxGet<Star>
  ) => (
    props: {
      barcode: number;
      museumId: number;
      collectionId: string;
      token: string;
    }
  ) => Observable<Star>;
}

MusitObject.getObjectDescription = obj => {
  let objStr = obj.museumNo ? `${obj.museumNo}` : '';
  objStr = obj.subNo ? `${objStr} - ${obj.subNo}` : objStr;
  objStr = obj.term ? `${objStr} - ${obj.term}` : objStr;
  return objStr;
};

MusitObject.isMainObject = obj => obj.id === obj.mainObjectId;

MusitObject.moveObjects = (
  { object, destination, doneBy, museumId, collectionId, token, callback },
  ajaxGet = simpleGet,
  ajaxPut = simplePut
) => {
  if (MusitObject.isMainObject(object)) {
    MusitObject.getMainObject(ajaxGet)({
      id: object.nodeId,
      museumId,
      collectionId,
      token,
      callback: callback ? { onFailure: callback.onFailure } : undefined
    })
      .toPromise()
      .then(objects =>
        objects.forEach((obj: TODO) =>
          MusitObject.moveSingleObject(ajaxPut)({
            objectTypeAndId: [{ objectType: obj.objectType, id: obj.id }],
            destination,
            doneBy,
            museumId,
            token,
            callback: MusitObject.isMainObject(obj) ? callback : undefined
          }).toPromise()
        )
      );
  } else {
    MusitObject.moveSingleObject(ajaxPut)({
      objectTypeAndId: [{ objectType: object.objectType, id: object.uuid }],
      destination,
      doneBy,
      museumId,
      token,
      callback
    }).toPromise();
  }
};

MusitObject.getObjectLocations = (ajaxPost = simplePost) => ({
  movableObjects,
  museumId,
  token,
  callback
}) =>
  ajaxPost(
    Config.magasin.urls.api.storagefacility.currentLocations(museumId),
    movableObjects,
    token,
    callback
  ).map(({ response }) =>
    movableObjects.map(o => ({ objectId: o.id, ...response[0].node }))
  );

MusitObject.getObjectLocation = (ajaxGet = simpleGet) => ({
  objectId,
  objectType,
  museumId,
  token,
  callback
}) =>
  ajaxGet(
    Config.magasin.urls.api.storagefacility.currentLocation(
      museumId,
      objectId,
      objectType
    ),
    token,
    callback
  ).map(({ response }) => ({ ...response, breadcrumb: getPath(response) }));

MusitObject.getObjectWithCurrentLocation = (ajaxGet = simpleGet) => ({
  objectId,
  museumId,
  token,
  collectionId,
  callback
}) =>
  Observable.forkJoin(
    MusitObject.getObjectDetails(ajaxGet)({
      id: objectId,
      museumId,
      collectionId,
      token,
      callback
    }),
    MusitObject.getObjectLocation(ajaxGet)({ objectId, museumId, token, callback })
  ).map(([{ response }, l]) => ({ ...response, currentLocation: l }));

MusitObject.getMainObject = (ajaxGet = simpleGet) => ({
  id,
  museumId,
  collectionId,
  token,
  callback
}) => {
  return ajaxGet(
    Config.magasin.urls.api.thingaggregate.getMainObject(museumId, id, collectionId),
    token,
    callback
  ).map(({ response }) => response);
};

MusitObject.getObjectDetails = (ajaxGet = simpleGet) => ({
  id,
  museumId,
  collectionId,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.thingaggregate.objectDetailsUrl(
    museumId,
    id,
    collectionId
  );
  return ajaxGet(url, token, callback);
};

MusitObject.getObjects = (ajaxGet = simpleGet) => props => {
  const url = Config.magasin.urls.api.thingaggregate.getObjectForCollection(
    props.museumId,
    props.id,
    props.collectionId,
    props.page || 1,
    Config.magasin.limit
  );
  return ajaxGet(url, props.token, props.callback).map(({ response }) => {
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
  destination,
  doneBy,
  objectTypeAndId,
  museumId,
  token,
  callback
}) => {
  const data = { doneBy, destination, items: objectTypeAndId };
  return ajaxPut(
    Config.magasin.urls.api.storagefacility.moveObject(museumId),
    data,
    token,
    callback
  );
};

MusitObject.getLocationHistory = (ajaxGet = simpleGet) => ({
  objectId,
  museumId,
  token,
  callback
}) => {
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

MusitObject.pickObject = (pickObject$, ajaxGet = simpleGet) => props => {
  if (MusitObject.isMainObject(props.object)) {
    MusitObject.getMainObject(ajaxGet)({ ...props, id: props.object.uuid } as TODO)
      .toPromise()
      .then(objects =>
        objects.forEach((obj: TODO) =>
          pickObject$.next({
            value: {
              ...obj,
              objectData: obj
            },
            path: props.breadcrumb
          })
        )
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

export default MusitObject;
