import {Observable} from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { simpleGet } from '../../shared/RxAjax';
import Config from '../../config';
import {getAccessToken} from '../../shared/token';
import { emitError } from '../../shared/errors';
import { I18n } from 'react-i18nify';
import MuseumId from '../../models/museumId';
import CollectionId from '../../models/collectionId';
import Actor from '../../models/actor';
import orderBy from 'lodash/orderBy';

export class AppSession {

  constructor(state) {
    this.state = state;
  }

  getAccessToken() {
    return this.state.accessToken;
  }

  getGroups() {
    return this.state.groups;
  }

  getActor() {
    return this.state.actor;
  }

  getMuseumId() {
    return this.state.museumId;
  }

  getCollectionId() {
    return this.state.collectionId;
  }

  getBuildNumber() {
    return this.state.buildInfo && this.state.buildInfo.buildInfoBuildNumber;
  }
}

const initialState = { accessToken: getAccessToken() };

const orderByMuseumId = (arr, dir = 'desc') => orderBy(arr, ['museumId'], [dir]);

const loadAppSession = (ajaxGet = simpleGet, accessToken) => {
  accessToken = accessToken || getAccessToken();
  if (!accessToken) {
    return Observable.empty();
  }
  return Observable.forkJoin(
    ajaxGet(Config.magasin.urls.auth.buildInfo, accessToken),
    ajaxGet(Config.magasin.urls.actor.currentUser, accessToken),
    ajaxGet(Config.magasin.urls.auth.museumsUrl, accessToken)
  ).switchMap(([buildInfoRes, currentUserRes, museumsRes]) =>
    ajaxGet(Config.magasin.urls.auth.groupsUrl(currentUserRes.response.dataportenUser), accessToken)
      .map(({response}) => {
        if (!response) {
          throw new Error(I18n.t('musit.errorMainMessages.noGroups'));
        }
        const isGod = !!response.find(group => 10000 === group.permission);
        let groups;
        if (isGod) {
          groups = museumsRes.response.filter(museum => 10000 !== museum.id)
            .map(museum => ({
              ...museum,
              museumId: museum.id,
              museumName: museum.shortName,
              permission: 10000,
              collections: [
                {
                  uuid: '00000000-0000-0000-0000-000000000000',
                  name: 'All'
                }
              ]
            }));
        } else {
          groups = response.map(group => ({
            ...group,
            museumName: museumsRes.response.find(m => m.id === group.museumId).shortName
          }));
        }
        groups = orderByMuseumId(groups);
        const museumId = new MuseumId(groups[0].museumId);
        const collectionId = new CollectionId(groups[0].collections[0].uuid);
        return {
          accessToken,
          actor: new Actor(currentUserRes.response),
          groups,
          museumId,
          collectionId,
          buildInfo: buildInfoRes.response
        };
      })
  );
};

export const loadAppSession$ = createAction('loadAppSession$').switchMap(loadAppSession);
export const setMuseumId$ = createAction('setMuseumId$');
export const setCollectionId$ = createAction('setCollectionId$');
export const setAccessToken$ = createAction('setAccessToken$');

export const refreshSession = (
  setMuseum = ((id) => setMuseumId$.next(id)),
  setCollection = ((id) => setCollectionId$.next(id))
)  => (params, appSession) => {
  const museumId = appSession.getMuseumId();
  const museumIdFromParam = new MuseumId(params.museumId * 1);
  if  ( museumIdFromParam.id && museumIdFromParam.id !== museumId.id) {
    setMuseum(museumIdFromParam);
  }
  const collectionId = appSession.getCollectionId();
  const collectionIdFromParam = new CollectionId(params.collectionIds);
  if  (collectionIdFromParam.uuid && collectionIdFromParam.uuid !== collectionId.uuid) {
    setCollection(collectionIdFromParam);
  }
};

export const reducer$ = (actions, onError = emitError) => Observable.merge(
  actions.setAccessToken$
    .map(accessToken => state => ({...state, accessToken})),
  actions.loadAppSession$
    .map(session => state => ({...state, ...session}))
    .catch(error => {
      onError(error);
      return Observable.of(state => ({...state, accessToken: null}));
    }),
  actions.setMuseumId$
    .map(museumId => state => ({...state, museumId})),
  actions.setCollectionId$
    .map(collectionId => state => ({...state, collectionId}))
);

const session$ = createStore('appSession', reducer$({ 
  setMuseumId$,
  setCollectionId$,
  setAccessToken$,
  loadAppSession$
}), Observable.of(initialState)).map(state => new AppSession(state));

export default session$;