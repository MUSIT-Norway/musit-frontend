// @flow
import { simpleGet, simpleDel, simplePut, simplePost } from '../shared/RxAjax';
import Config from '../config';
import { mapToBackend, mapToFrontend } from './mapper/node';
import MusitActor from './actor';
import MusitObject from './object';
import { Observable, Subject } from 'rxjs';
import { Callback, AjaxGet, AjaxPost, AjaxPut, AjaxDel } from '../types/ajax';
import { Breadcrumb } from './types/breadcrumb';
import { Node, NodeStats } from '../types/node';
import { Star, mixed, Maybe, MUSTFIX } from '../types/common';

export type Paging = {
  page: number;
  limit: number;
};

export type MoveResult = {
  moved: number;
  failed: number;
};

export type SearchResult = {
  totalMatches?: number;
  matches?: Array<Star>;
  error?: string;
};

class MusitNode {
  static isRootNode: (node: Node) => boolean;
  static getNode: (
    ajaxGet?: AjaxGet<Star>
  ) => (
    props: {
      id: string;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Node>;
  static getNodeWithUpdatedBy: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      id: string;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Node & { updatedByName: Maybe<string> }>;
  static addNode: (
    ajaxPost?: AjaxPost<Star>
  ) => (
    props: {
      id: string;
      museumId: number;
      token: string;
      data: mixed;
      callback?: Callback<Star>;
    }
  ) => Observable<Node>;
  static editNode: (
    ajaxPut?: AjaxPut<Star>
  ) => (
    props: {
      id: string;
      museumId: number;
      token: string;
      data: mixed;
      callback?: Callback<Star>;
    }
  ) => Observable<Node>;
  static getNodes: (
    ajaxGet?: AjaxGet<Star>
  ) => (
    props: {
      id: string;
      page?: Paging;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<SearchResult>;
  static getStats: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      id: string;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<NodeStats>;
  static deleteNode: (
    ajaxDel?: AjaxDel<Star>
  ) => (
    props: {
      id: string;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<string>;
  static moveNode: (
    ajaxPut?: AjaxPut<Star>
  ) => (
    props: {
      id: string;
      destination: string;
      doneBy: string;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<MoveResult>;
  static pickNode: (
    pickNode$: Subject<Star>
  ) => (
    props: {
      node: mixed;
      breadcrumb: Breadcrumb;
    }
  ) => void;
  static findByBarcode: (
    ajaxGet?: AjaxGet<Star>
  ) => (
    props: {
      barcode: number;
      museumId: number;
      token: string;
    }
  ) => Observable<Star>;
  static findNodeOrObjectByBarcode: (
    ajaxGet?: AjaxGet<Star>
  ) => (
    props: {
      barcode: number;
      museumId: number;
      collectionId: string;
      token: string;
    }
  ) => Observable<Star>;
  static findByUUID: (
    ajaxGet?: AjaxGet<Star>
  ) => (
    props: {
      uuid: string;
      museumId: number;
      token: string;
    }
  ) => Observable<Star>;
}

MusitNode.isRootNode = node => node.type === 'Root' || node.type === 'RootLoan';

MusitNode.getNode = (ajaxGet = simpleGet) => ({ id, museumId, token, callback }) =>
  ajaxGet(
    Config.magasin.urls.api.storagefacility.nodeUrl(museumId, id),
    token,
    callback
  ).map(node => node.response && mapToFrontend(node.response));

MusitNode.getNodeWithUpdatedBy = (ajaxGet = simpleGet) => props =>
  MusitNode.getNode(ajaxGet)(props).flatMap(node => {
    if (node.updatedBy) {
      const updatedBy = node.updatedBy;
      return MusitActor.getActor(ajaxGet)({
        token: props.token,
        actorId: updatedBy
      }).map(actor => ({ ...node, updatedByName: actor ? actor.fn : null }));
    }
    return Observable.of({ ...node, updatedByName: null });
  });

MusitNode.addNode = (ajaxPost = simplePost) => ({
  id,
  museumId,
  token,
  data,
  callback
}) => {
  const url = id
    ? Config.magasin.urls.api.storagefacility.baseUrl(museumId)
    : Config.magasin.urls.api.storagefacility.rootNodeUrl(museumId);
  const dataToPost = mapToBackend(data, id as MUSTFIX);
  return ajaxPost(url, dataToPost, token, callback).map(({ response }) => response);
};

MusitNode.editNode = (ajaxPut = simplePut) => ({
  id,
  museumId,
  token,
  data,
  callback
}) => {
  const dataToPost = mapToBackend(data);
  return ajaxPut(
    Config.magasin.urls.api.storagefacility.nodeUrl(museumId, id),
    dataToPost,
    token,
    callback
  ).map(({ response }) => response);
};

MusitNode.getNodes = (ajaxGet = simpleGet) => ({
  id,
  page,
  museumId,
  token,
  callback
}) => {
  const url = id
    ? Config.magasin.urls.api.storagefacility.childrenNodesUrl(
        museumId,
        id,
        page && page.page,
        page && page.limit
      )
    : Config.magasin.urls.api.storagefacility.rootNodeUrl(museumId);
  return ajaxGet(url, token, callback).map(({ response }) => {
    if (!response) {
      return { totalMatches: 0, matches: [], error: 'no response body' };
    }
    const matches = response.matches || response;
    if (!Array.isArray(matches)) {
      return { totalMatches: 0, matches: [], error: 'response body is not an array' };
    }
    return {
      totalMatches: response.totalMatches || response.length,
      matches
    };
  });
};

MusitNode.getStats = (ajaxGet = simpleGet) => ({ id, museumId, token, callback }) => {
  return ajaxGet(
    Config.magasin.urls.api.thingaggregate.nodeStatsUrl(museumId, id),
    token,
    callback
  ).map(({ response }) => response);
};

MusitNode.deleteNode = (ajaxDel = simpleDel) => ({ id, museumId, token, callback }) => {
  return ajaxDel(
    Config.magasin.urls.api.storagefacility.nodeUrl(museumId, id),
    token,
    callback
  );
};

MusitNode.moveNode = (ajaxPut = simplePut) => ({
  id,
  destination,
  doneBy,
  museumId,
  token,
  callback
}) => {
  const data = { doneBy, destination, items: [].concat(id as MUSTFIX) };
  return ajaxPut(
    Config.magasin.urls.api.storagefacility.moveNodeUrl(museumId),
    data,
    token,
    callback
  );
};

MusitNode.pickNode = pickNode$ => ({ node, breadcrumb }) => {
  pickNode$.next({ value: node, path: breadcrumb });
};

MusitNode.findByBarcode = (ajaxGet = simpleGet) => ({ barcode, museumId, token }) =>
  ajaxGet(
    Config.magasin.urls.api.storagefacility.scanOldUrl(barcode, museumId),
    token
  ).map(({ response }) => response);

MusitNode.findNodeOrObjectByBarcode = (ajaxGet = simpleGet) => ({
  barcode,
  museumId,
  collectionId,
  token
}) => {
  return MusitNode.findByBarcode(ajaxGet)({
    barcode,
    museumId,
    token
  }).flatMap(nodeResponse => {
    if (!nodeResponse) {
      return MusitObject.findByBarcode(ajaxGet)({
        barcode,
        museumId,
        collectionId,
        token
      });
    }
    return Observable.of(nodeResponse);
  });
};

MusitNode.findByUUID = (ajaxGet = simpleGet) => ({ uuid, museumId, token }) => {
  return ajaxGet(
    Config.magasin.urls.api.storagefacility.scanUrl(uuid, museumId),
    token
  ).map(({ response }) => response);
};

export default MusitNode;
