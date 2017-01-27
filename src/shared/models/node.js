import { simpleGet, simpleDel, simplePut } from '../../rxjs/ajax';
import Config from '../../config';
import MuseumId from '../../shared/models/museumId';
import entries from 'object.entries';
import { getPath } from '../../shared/util';
import { addNode$ as pickNode$ } from '../../modules/app/pickList';

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

MusitNode.getNode = (id: number, museumId: MuseumId, token: string, callback) => {
  return simpleGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`, token, callback).map(node => new MusitNode(node));
};

MusitNode.getNodes = (id: number, page: number, museumId: MuseumId, token: string, callback) => {
  const baseUrl = Config.magasin.urls.storagefacility.baseUrl(museumId);
  let url;
  if (id) {
    url = `${baseUrl}/${id}/children?page=${page || 1}&limit=${Config.magasin.limit}`;
  } else {
    url = `${baseUrl}/root`;
  }
  return simpleGet(url, token, callback)
    .map(data => ({
      totalMatches: data.totalMatches || data.length,
      matches: (data.matches || data).map(o => new MusitNode(o))
    }));
};

MusitNode.getStats = (id: number, museumId: MuseumId, token: string, callback) => {
  const baseUrl = Config.magasin.urls.thingaggregate.baseUrl(museumId);
  return simpleGet(`${baseUrl}/storagenodes/${id}/stats`, token, callback);
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