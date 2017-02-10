import { simpleGet, simplePut, simplePost } from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';
import { getPath } from '../shared/util';
import flatMap from 'lodash/flatMap';

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

  moveObject({destination, doneBy, museumId, collectionId, token, callback}) {
    if (this.isMainObject()) {
      MusitObject.getMainObject(this.id, museumId, collectionId, token, { onFailure: callback.onFailure })
        .toPromise()
        .then(objects =>
          objects.forEach(obj =>
            MusitObject.moveObject()({ id: obj.id, destination, doneBy, museumId, token, callback: obj.isMainObject() ? callback : null })
              .toPromise()
          )
        );
    } else {
      MusitObject.moveObject()({ id: this.id, destination, doneBy, museumId, token, callback })
        .toPromise();
    }
  }
}

MusitObject.getObjectLocation = (ajaxGet = simpleGet) => ({ id, museumId, token, callback }) =>
  ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/objects/${id}/currentlocation`, token, callback)
    .map(({ response }) => ({...response, objectId: id }));

MusitObject.getObjectLocations = (ajaxPost = simplePost) => ({ objectIds, museumId, token, callback }) =>
  ajaxPost(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/objects/currentlocations`, objectIds, token, callback)
    .map(({ response }) => {
      return flatMap(response, (ls) => {
        return ls.objectIds.map(objectId => ({
          objectId,
          ...ls.node
        })
        );
      });
    });

MusitObject.getMainObject = (ajaxGet = simpleGet) => ({ id, museumId, collectionId, token, callback }) => {
  return ajaxGet(`${Config.magasin.urls.thingaggregate.baseUrl(museumId)}/objects/${id}/children?${collectionId.getQuery()}`, token, callback)
    .map(({ response }) => response && response.map(obj => new MusitObject(obj)));
};

MusitObject.getObjects = (ajaxGet = simpleGet) => ({id, page, museumId, collectionId, token, callback}) => {
  const baseUrl = Config.magasin.urls.thingaggregate.baseUrl(museumId);
  const url = `${baseUrl}/node/${id}/objects?${collectionId.getQuery()}&page=${page || 1}&limit=${Config.magasin.limit}`;
  return ajaxGet(url, token, callback)
    .map(({ response }) => {
      if (!response) {
        return {...response, matches: [], error: 'no response body'};
      }
      return {
        ...response,
        matches: response.matches ? response.matches.map(obj => new MusitObject(obj)) : []
      };
    });
};

MusitObject.moveObject = (ajaxPut = simplePut) => ({ id, destination, doneBy, museumId, token, callback }) => {
  const data = { doneBy, destination, items: [].concat(id) };
  return ajaxPut(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/moveObject`, data, token, callback);
};

MusitObject.getLocationHistory = (ajaxGet = simpleGet) => ({ id, museumId, token, callback }) => {
  return ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/objects/${id}/locations`, token, callback)
    .map(({ response }) => {
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


MusitObject.pickObject = (pickObject$, ajaxGet = simpleGet) => (props) => {
  console.log('pickObject');
  if (props.object.isMainObject()) {
    MusitObject.getMainObject(ajaxGet)({ ...props, id: props.object.id })
      .toPromise()
      .then(objects =>
        objects.forEach(obj => pickObject$.next({value: obj, path: props.breadcrumb}))
      );
  } else {
    pickObject$.next({value: props.object, path: props.breadcrumb});
  }
};

MusitObject.searchForObjects = (ajaxGet) => (params, page, museumId, collectionId, token, callback) => {
  const url = Config.magasin.urls.thingaggregate.searchObjectUrl(params, page, collectionId, museumId);
  return ajaxGet(url, token, callback)
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