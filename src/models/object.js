import { simpleGet, simplePut } from '../shared/RxAjax';
import Config from '../config';
import MuseumId from './museumId';
import CollectionId from './collectionId';
import entries from 'object.entries';
import { addObject$ as pickObject$ } from '../modules/app/pickList';
import { getPath } from '../shared/util';

class MusitObject {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }

  getObjectDescription() {
    let objStr = this.museumNo ? `${this.museumNo}` : '';
    objStr = this.subNo ? `${objStr} - ${this.subNo}` : objStr;
    objStr = this.term ? `${objStr} - ${this.term}` : objStr;
    return objStr;
  }

  isMainObject() {
    return this.id === this.mainObjectId;
  }

  moveObject(destination, doneBy, museumId, collectionId, token, callback) {
    if (this.isMainObject()) {
      MusitObject.getMainObject(this.id, museumId, collectionId, token, { onFailure: callback.onFailure })
        .toPromise()
        .then(objects =>
          objects.forEach(obj =>
            MusitObject.moveObject(obj.id, destination, doneBy, museumId, token, obj.isMainObject() ? callback : null)
              .toPromise()
          )
        );
    } else {
      MusitObject.moveObject(this.id, destination, doneBy, museumId, token, callback)
        .toPromise();
    }
  }
}

MusitObject.getObjectLocation = (id: number, museumId: MuseumId, token: string, callback) => {
  return simpleGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/objects/${id}/currentlocation`, token, callback)
    .map(({ response }) => response);
};

MusitObject.getMainObject = (id: number, museumId: MuseumId, collectionId: CollectionId, token: string, callback) => {
  return simpleGet(`${Config.magasin.urls.thingaggregate.baseUrl(museumId)}/objects/${id}/children?${collectionId.getQuery()}`, token, callback)
    .map(({ response }) => response)
    .map(objects => objects.map(obj => new MusitObject(obj)));
};

MusitObject.getObjects = (id: number, page: number, museumId: MuseumId, collectionId: CollectionId, token: string, callback) => {
  const baseUrl = Config.magasin.urls.thingaggregate.baseUrl(museumId);
  const url = `${baseUrl}/node/${id}/objects?${collectionId.getQuery()}&page=${page || 1}&limit=${Config.magasin.limit}`;
  return simpleGet(url, token, callback)
    .map(({ response }) => response)
    .map(data => {
      if (!data) {
        return {...data, matches: [], error: 'no response body'};
      }
      return {
        ...data,
        matches: data.matches ? data.matches.map(obj => new MusitObject(obj)) : []
      };
    });
};

MusitObject.moveObject = (objectId, destination, doneBy, museumId, token, callback) => {
  const data = { doneBy, destination, items: [].concat(objectId) };
  return simplePut(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/moveObject`, data, token, callback);
};

MusitObject.getLocationHistory = (id, museumId, token, callback) => {
  return simpleGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/objects/${id}/locations`, token, callback)
    .map(({ response }) => response)
    .map(rowsJson => {
      if (!Array.isArray(rowsJson)) {
        return [];
      }
      return rowsJson.map(data => {
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

MusitObject.pickObject = (object, breadcrumb, museumId, collectionId, token, callback) => {
  if (object.isMainObject()) {
    MusitObject.getMainObject(object.id, museumId, collectionId, token, callback)
      .toPromise()
      .then(objects =>
        objects.forEach(obj => pickObject$.next({value: obj, path: breadcrumb}))
      );
  } else {
    pickObject$.next({value: object, path: breadcrumb});
  }
};

MusitObject.searchForObjects = (params, page, museumId, collectionId, token, callback) => {
  const url = Config.magasin.urls.thingaggregate.searchObjectUrl(params, page, collectionId, museumId);
  return simpleGet(url, token, callback)
    .map(({ response }) => response)
    .map(data => {
      if (!data) {
        return {...data, matches: [], totalMatches: 0, error: 'no response body'};
      }
      return {
        ...data,
        matches: data.matches ? data.matches.map(obj => new MusitObject(obj)) : []
      };
    });
};

export default MusitObject;