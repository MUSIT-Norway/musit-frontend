import { simpleGet, simpleDel, simplePut } from '../shared/RxAjax';
import Config from '../config';
import MuseumId from './museumId';
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

MusitNode.getNode = (ajaxGet) => (id: number, museumId: MuseumId, token: string, callback) => {
  return ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`, token, callback)
    .map(({ response }) => response && new MusitNode(response));
};

MusitNode.addNode = (ajaxPost) => (parentId: number,  museumId: MuseumId, token:string, data, callback) => {
  const baseUrl= Config.magasin.urls.storagefacility.baseUrl(museumId);
  const url = `${baseUrl}/${museumId.id}/${!parentId ? '/root' : ''}`;
  const dataToPost = { data: mapToBackend(data) };
  return ajaxPost(url,dataToPost,token,callback).map(({ response }) => response && MusitNode(response));
};

MusitNode.editNode = (ajaxPut) => (id: number,  museumId: MuseumId, token:string, data, callback) => {
  const baseUrl= Config.magasin.urls.storagefacility.baseUrl(museumId);
  const url = `${baseUrl}/${museumId.id}}/${id}`;
  const dataToPost = { data: mapToBackend(data) };
  return ajaxPut(url,dataToPost,token,callback).map(({ response }) => response && MusitNode(response));
};

MusitNode.getNodes = (id: number, page, museumId: MuseumId, token: string, callback) => {
  const baseUrl = Config.magasin.urls.storagefacility.baseUrl(museumId);
  let url;
  if (id) {
    const pageNum = page && page.page ? page.page : (page || 1);
    const limit = page && page.limit ? page.limit : Config.magasin.limit;
    url = `${baseUrl}/${id}/children?page=${pageNum}&limit=${limit}`;
  } else {
    url = `${baseUrl}/root`;
  }
  return simpleGet(url, token, callback)
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

MusitNode.getStats = (id: number, museumId: MuseumId, token: string, callback) => {
  const baseUrl = Config.magasin.urls.thingaggregate.baseUrl(museumId);
  return simpleGet(`${baseUrl}/storagenodes/${id}/stats`, token, callback)
    .map(({ response }) => response);
};

MusitNode.deleteNode = (id: number, museumId: MuseumId, token: string, callback) => {
  const baseUrl = Config.magasin.urls.storagefacility.baseUrl(museumId);
  return simpleDel(`${baseUrl}/${id}`, token, callback)
    .toPromise();
};

MusitNode.moveNode = (id: number, destination, doneBy, museumId: MuseumId, token: string, callback) => {
  const data = { doneBy, destination, items: [].concat(id) };
  return simplePut(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/moveNode`, data, token, callback);
};

MusitNode.pickNode = (node, breadcrumb) => {
  pickNode$.next({ value: node, path: breadcrumb });
};

export default MusitNode;