import { simpleGet, simpleDel, simplePut, simplePost } from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';
import { getPath } from '../shared/util';
import { addNode$ as pickNode$ } from '../modules/app/pickList';
import { mapToBackend } from './mapper';

class MusitNode {

  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
    this.breadcrumb = getPath(props);
  }

  isRootNode() {
    return this.type === 'Root' || this.type === 'RootLoan';
  }

  moveNode(destination, doneBy, museumId, token, callback) {
    return MusitNode.moveNode(this.id, destination, doneBy, museumId, token, callback)
      .toPromise();
  }
}

MusitNode.getNode = (ajaxGet = simpleGet) => ({id, museumId, token, callback}) => {
  return ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`, token, callback)
    .map(({ response }) => response && new MusitNode(response));
};

MusitNode.addNode = (ajaxPost = simplePost) => ({id, museumId, token, data, callback}) => {
  const baseUrl= Config.magasin.urls.storagefacility.baseUrl(museumId);
  const url = `${baseUrl}/${museumId.id}/${!id ? '/root' : ''}`;
  const dataToPost = { data: mapToBackend(data) };
  return ajaxPost(url,dataToPost,token,callback).map(({ response }) => response && MusitNode(response));
};

MusitNode.editNode = (ajaxPut = simplePut) => ({id,  museumId, token, data, callback}) => {
  const baseUrl= Config.magasin.urls.storagefacility.baseUrl(museumId);
  const url = `${baseUrl}/${museumId.id}}/${id}`;
  const dataToPost = { data: mapToBackend(data) };
  return ajaxPut(url,dataToPost,token,callback).map(({ response }) => response && MusitNode(response));
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
  return ajaxDel(`${baseUrl}/${id}`, token, callback)
    .toPromise();
};

MusitNode.moveNode = (ajaxPut = simplePut) => ({id, destination, doneBy, museumId, token, callback}) => {
  const data = { doneBy, destination, items: [].concat(id) };
  return ajaxPut(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/moveNode`, data, token, callback);
};

MusitNode.pickNode = (node, breadcrumb) => {
  pickNode$.next({ value: node, path: breadcrumb });
};

export default MusitNode;