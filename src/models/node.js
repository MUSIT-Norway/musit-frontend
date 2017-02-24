import { simpleGet, simpleDel, simplePut, simplePost } from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';
import { getPath } from '../shared/util';
import { mapToBackend, mapToFrontend } from './mapper/node';
import MusitActor from './actor';
import MusitObject from './object';
import { Observable } from 'rxjs';

class MusitNode {

  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
    this.breadcrumb = getPath(props);
  }

  isRootNode() {
    return this.type === 'Root' || this.type === 'RootLoan';
  }

  moveNode({ destination, doneBy, museumId, token, callback }) {
    return MusitNode.moveNode()({ id: this.id, destination, doneBy, museumId, token, callback})
      .toPromise();
  }
}

MusitNode.getNode = (ajaxGet = simpleGet) => ({id, museumId, token, callback}) => {
  return ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`, token, callback)
    .map((node) => node.response && new MusitNode(mapToFrontend(node.response)));
};

MusitNode.getNodeWithUpdatedBy = (ajaxGet = simpleGet) => (props) => {
  return MusitNode.getNode(ajaxGet)(props)
    .flatMap(node =>
      MusitActor.getActor(ajaxGet)({ token: props.token, actorId: node.updatedBy })
        .map(actor => {
          if (!actor) {
            return node;
          }
          return {...node, updatedByName: actor.fn};
        })
    );
};

MusitNode.addNode = (ajaxPost = simplePost) => ({id, museumId, token, data, callback}) => {
  const baseUrl= Config.magasin.urls.storagefacility.baseUrl(museumId);
  const url = `${baseUrl}${!id ? '/root' : ''}`;
  const dataToPost = mapToBackend(data, id);
  return ajaxPost(url, dataToPost, token, callback).map(({ response }) => response && new MusitNode(response));
};

MusitNode.editNode = (ajaxPut = simplePut) => ({id,  museumId, token, data, callback}) => {
  const baseUrl= Config.magasin.urls.storagefacility.baseUrl(museumId);
  const url = `${baseUrl}/${id}`;
  const dataToPost = mapToBackend(data);
  return ajaxPut(url,dataToPost,token,callback).map(({ response }) => response && new MusitNode(response));
};

MusitNode.getNodes = (ajaxGet = simpleGet) => ({id, page, museumId, token, callback}) => {
  const baseUrl = Config.magasin.urls.storagefacility.baseUrl(museumId);
  let url;
  if (id) {
    const pageNum = page && page.page ? page.page : (page || 1);
    const limit = page && page.limit ? page.limit : Config.magasin.limit;
    url = `${baseUrl}/${id}/children?page=${pageNum}&limit=${limit}`;
  } else {
    url = `${baseUrl}/root`;
  }
  return ajaxGet(url, token, callback)
    .map(({ response }) => {
      if (!response) {
        return { totalMatches: 0, matches: [], error: 'no response body' };
      }
      const matches = response.matches || response;
      if (!Array.isArray(matches)) {
        return { totalMatches: 0, matches: [], error: 'response body is not an array' };
      }
      return {
        totalMatches: response.totalMatches || response.length,
        matches: matches.map(o => new MusitNode(o))
      };
    });
};

MusitNode.getStats = (ajaxGet = simpleGet) => ({id, museumId, token, callback}) => {
  const baseUrl = Config.magasin.urls.thingaggregate.baseUrl(museumId);
  return ajaxGet(`${baseUrl}/storagenodes/${id}/stats`, token, callback)
    .map(({ response }) => response);
};

MusitNode.deleteNode = (ajaxDel = simpleDel) => ({id, museumId, token, callback}) => {
  const baseUrl = Config.magasin.urls.storagefacility.baseUrl(museumId);
  return ajaxDel(`${baseUrl}/${id}`, token, callback);
};

MusitNode.moveNode = (ajaxPut = simplePut) => ({id, destination, doneBy, museumId, token, callback}) => {
  const data = { doneBy, destination, items: [].concat(id) };
  return ajaxPut(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/moveNode`, data, token, callback);
};

MusitNode.pickNode = (pickNode$) => ({node, breadcrumb}) => {
  pickNode$.next({ value: node, path: breadcrumb });
};

MusitNode.findByBarcode = (ajaxGet = simpleGet) => ({ barcode, museumId, collectionId, token}) => {
  return ajaxGet(Config.magasin.urls.storagefacility.scanOldUrl(barcode, museumId), token)
    .map(({ response }) => response && new MusitNode(response))
    .flatMap((nodeResponse) => {
      if (!nodeResponse) {
        return MusitObject.findByBarcode(ajaxGet)({ barcode, museumId, collectionId, token});
      }
      return Observable.of(nodeResponse);
    });
};

MusitNode.findByUUID = (ajaxGet = simpleGet) => ({ uuid, museumId, token }) => {
  return ajaxGet(Config.magasin.urls.storagefacility.scanUrl(uuid, museumId), token)
    .map(({ response }) => response && new MusitNode(response));
};


export default MusitNode;