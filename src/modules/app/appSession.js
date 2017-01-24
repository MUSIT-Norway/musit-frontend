import {Observable} from 'rxjs';
import {createStore, createActions} from '../../state/RxStore';
import {get as ajaxGet} from '../../state/ajax';
import Config from '../../config';
import {getAccessToken} from '../../shared/token';
import { emitError } from '../../shared/errors/emitter';
import { dispatchAction } from '../../shared/util';
import { I18n } from 'react-i18nify';
import MuseumId from '../../shared/models/museumId';
import CollectionId from '../../shared/models/collectionId';
import Actor from '../../shared/models/actor';
import { SET_COLLECTION, SET_MUSEUM } from '../../redux/sessionReducer';
import CodeReceiver from './codeReceiver';

export default class AppSession {
  store$: Observable;
  state: Object = { accessToken: getAccessToken() };
  actions: Object = createActions('setMuseumId$', 'setCollectionId$', 'setAccessToken$', 'loadAppSession$');

  constructor() {
    this.codeRecieiver = new CodeReceiver(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getCollectionId = this.getCollectionId.bind(this);
    this.setCollectionId = this.setCollectionId.bind(this);
    this.getMuseumId = this.getMuseumId.bind(this);
    this.setMuseumId = this.setMuseumId.bind(this);
    this.getBuildNumber = this.getBuildNumber.bind(this);
    this.loadAppSession = this.loadAppSession.bind(this);
    this.__loadAppSession = this.__loadAppSession.bind(this);
    const reducer$ = Observable.merge(
      this.actions.setAccessToken$
        .map(accessToken => state => ({...state, accessToken})),
      this.actions.loadAppSession$
        .filter(() => this.state.accessToken)
        .switchMap(this.__loadAppSession)
        .map(session => state => ({...state, ...session}))
        .catch(error => {
          emitError(error);
          return Observable.of(state => ({...state, accessToken: null}));
        }),
      this.actions.setMuseumId$
        .map(museumId => state => ({...state, museumId})),
      this.actions.setCollectionId$
        .map(collectionId => state => ({...state, collectionId}))
    );
    this.store$ = createStore(reducer$, Observable.of(this.state));
    this.store$.subscribe((state) => this.state = state);
  }

  /**
   * Returns an observable for loading the session.
   *
   * @returns {Observable<R|I>|Observable<R>|*}
   * @private
   */
  __loadAppSession() {
    return Observable.forkJoin(
      ajaxGet(Config.magasin.urls.auth.buildInfo, this.state.accessToken),
      ajaxGet(Config.magasin.urls.actor.currentUser, this.state.accessToken),
      ajaxGet(Config.magasin.urls.auth.museumsUrl, this.state.accessToken)
    ).switchMap(([buildInfoRes, currentUserRes, museumsRes]) =>
      ajaxGet(Config.magasin.urls.auth.groupsUrl(currentUserRes.response.dataportenUser), this.state.accessToken)
        .map(({response}) => {
          if (!response) {
            emitError({ message: I18n.t('musit.errorMainMessages.noGroups') });
            return null;
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
          const museumId = new MuseumId(groups[0].museumId);
          dispatchAction({ type: SET_MUSEUM, museumId });
          const collectionId = new CollectionId(groups[0].collections[0].uuid);
          dispatchAction({ type: SET_COLLECTION, collectionId });
          return {
            actor: new Actor(currentUserRes.response),
            groups,
            museumId,
            collectionId,
            buildInfo: buildInfoRes.response
          };
        })
    );
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

  setAccessToken(token) {
    this.actions.setAccessToken$.next(token);
  }

  getMuseumId() {
    return this.state.museumId;
  }

  setMuseumId(mid) {
    this.actions.setMuseumId$.next(mid);
  }

  getCollectionId() {
    return this.state.collectionId;
  }

  setCollectionId(cid) {
    this.actions.setCollectionId$.next(cid);
  }

  loadAppSession() {
    this.actions.loadAppSession$.next();
  }

  getBuildNumber() {
    return this.state.buildInfo && this.state.buildInfo.buildInfoBuildNumber;
  }
}
