import { simpleGet, simplePut, simplePost } from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';
import { getPath } from '../shared/util';
import flatMap from 'lodash/flatMap';
import MusitActor from './actor';
import uniq from 'lodash/uniq';
import { I18n } from 'react-i18nify';

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
      MusitObject.getMainObject()({ id: this.id, museumId, collectionId, token, callback: { onFailure: callback.onFailure } })
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

// Object types
// [
MusitObject.COLLECTION_OBJECT = 'collection';
MusitObject.SAMPLE_OBJECT = 'sample';
// ]

MusitObject.getObjectLocations = (ajaxPost = simplePost) => ({ objectIds, museumId, token, callback }) =>
  ajaxPost(`${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/objects/currentlocations`, objectIds, token, callback)
    .map(({ response }) => {
      return flatMap(response, (ls) => {
        return ls.objectIds.map(objectId => ({
          objectId,
          ...ls.node
        })
        );
      });
    });

MusitObject.getObjectLocation = (ajaxGet = simpleGet) => ({ objectId, museumId, token, callback }) =>
  ajaxGet(`${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/objects/${objectId}/currentlocation`, token, callback)
    .map(({ response }) => ({...response, breadcrumb: getPath(response)}));

MusitObject.getMainObject = (ajaxGet = simpleGet) => ({ id, museumId, collectionId, token, callback }) => {
  return ajaxGet(`${Config.magasin.urls.api.thingaggregate.baseUrl(museumId)}/objects/${id}/children?${collectionId.getQuery()}`, token, callback)
    .map(({ response }) => response && response.map(obj => new MusitObject(obj)));
};

MusitObject.getObjects = (ajaxGet = simpleGet) => ({id, page, museumId, collectionId, token, callback}) => {
  const baseUrl = Config.magasin.urls.api.thingaggregate.baseUrl(museumId);
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

MusitObject.moveObject = (ajaxPut = simplePut) => (
  { id, destination, doneBy, objectType = MusitObject.COLLECTION_OBJECT, museumId, token, callback }
) => {
  const items = [].concat(id).map((objectId) => ({ id: objectId, objectType }));
  const data = { doneBy, destination, items };
  return ajaxPut(`${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/moveObject`, data, token, callback);
};

MusitObject.getLocationHistory = (ajaxGet = simpleGet, ajaxPost = simplePost) => ({ objectId, museumId, token, callback }) => {
  return ajaxGet(`${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/objects/${objectId}/locations`, token, callback)
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
    })
    .flatMap(rows => {
      const actorIds = uniq(rows.map(r => r.doneBy)).filter(r => r);
      return MusitActor.getActors(ajaxPost)(actorIds, token)
        .map(actors => {
          if (!Array.isArray(actors)) {
            return rows;
          }
          return rows.map((data) => {
            const doneBy = actors.find(a => a.hasActorId(data.doneBy));
            return {
              ...data,
              doneBy: doneBy ? doneBy.fn : I18n.t('musit.unknown')
            };
          });
        });
    });
};


MusitObject.pickObject = (pickObject$, ajaxGet = simpleGet) => (props) => {
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

MusitObject.findByBarcode = (ajaxGet = simpleGet) => ({ barcode, museumId, collectionId, token }) =>
  ajaxGet(Config.magasin.urls.api.thingaggregate.scanOldUrl(barcode, museumId, collectionId), token)
    .map(({response}) => response && response.map(r => new MusitObject(r)));


MusitObject.searchForObjects = (ajaxGet = simpleGet) => ({ museumNo, subNo, term, perPage, page, museumId, collectionId, token, callback }) => {
  const url = Config.magasin.urls.api.thingaggregate.searchObjectUrl(museumNo, subNo, term, perPage, page, collectionId, museumId);
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