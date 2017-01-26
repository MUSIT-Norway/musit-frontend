import { simpleGet, simplePut } from '../../rxjs/ajax';
import Config from '../../config';
import MuseumId from '../../shared/models/museumId';
import CollectionId from '../../shared/models/collectionId';
import entries from 'object.entries';
import { addObject$ as pickObject$ } from '../../modules/app/pickList';

class MusitObject {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
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
    .map(location => ({...location, objectId: id}));
};

MusitObject.getMainObject = (id: number, museumId: MuseumId, collectionId: CollectionId, token: string, callback) => {
  return simpleGet(`${Config.magasin.urls.thingaggregate.baseUrl(museumId)}/objects/${id}/children?${collectionId.getQuery()}`, token, callback)
    .map(objects => objects.map(obj => new MusitObject(obj)));
};

MusitObject.getObjects = (id: number, page: number, museumId: MuseumId, collectionId: CollectionId, token: string, callback) => {
  const baseUrl = Config.magasin.urls.thingaggregate.baseUrl(museumId);
  const url = `${baseUrl}/node/${id}/objects?${collectionId.getQuery()}&page=${page || 1}&limit=${Config.magasin.limit}`;
  return simpleGet(url, token, callback)
    .map(data => ({
      ...data,
      matches: data.matches.map(obj => new MusitObject(obj))
    }));
};

MusitObject.moveObject = (objectId, destination, doneBy, museumId, token, callback) => {
  const data = { doneBy, destination, items: [].concat(objectId) };
  return simplePut(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/moveObject`, data, token, callback);
};

MusitObject.pickMainObject = (objectId, node, museumId, collectionId, token, callback) => {
  MusitObject.getMainObject(objectId, museumId, collectionId, token, callback)
    .toPromise()
    .then(objects =>
      objects.forEach(obj => pickObject$.next({value: obj, path: node.breadcrumb}))
    );
};

export default MusitObject;