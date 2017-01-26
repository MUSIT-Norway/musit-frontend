import { simpleGet, simpleDel, simplePut } from '../../rxjs/ajax';
import Config from '../../config';
import MuseumId from '../../shared/models/museumId';
import entries from 'object.entries';
import { getPath } from '../../shared/util';

class MusitNode {

  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
    this.breadcrumb = getPath(props);
  }

  isRootNode() {
    return this.type === 'Root' || this.type === 'RootLoan';
  }

  static getNode(id: number, museumId: MuseumId, token: string, callback) {
    return simpleGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`, token, callback).map(node => new MusitNode(node));
  }

  static getNodes(id: number, page: number, museumId: MuseumId, token: string, callback) {
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
  }

  static getStats(id: number, museumId: MuseumId, token: string, callback) {
    const baseUrl = Config.magasin.urls.thingaggregate.baseUrl(museumId);
    return simpleGet(`${baseUrl}/storagenodes/${id}/stats`, token, callback);
  }

  static deleteNode(id: number, museumId: MuseumId, token: string, callback) {
    const baseUrl = Config.magasin.urls.storagefacility.baseUrl(museumId);
    return simpleDel(`${baseUrl}/${id}`, token, callback);
  }

  static moveNode(id, destination, doneBy, museumId, token, callback) {
    const data = { doneBy, destination, items: [].concat(id) };
    return simplePut(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/moveNode`, data, token, callback);
  }

  moveNode(destination, doneBy, museumId, token, callback) {
    return MusitNode.moveNode(this.id, destination, doneBy, museumId, token, callback).toPromise();
  }
}

export default MusitNode;