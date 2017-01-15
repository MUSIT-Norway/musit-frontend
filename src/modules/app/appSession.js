import { Observable } from 'rxjs';
import { createStore, createActions } from '../../state/RxStore';
import { get as ajaxGet } from '../../state/ajax';
import deepFreeze from 'deep-freeze';
import Config from '../../config';
import { getAccessToken, clearAccessToken } from '../../shared/token';

class AppSession {
  __state__: Object = deepFreeze({ accessToken: getAccessToken(), actor: {}, groups: [], museumId: 99 });
  __error__: Object;
  __store$__: Observable;
  __actions__: Object = createActions('setMuseumId$', 'setCollectionId$', 'setAccessToken$', 'loadBuildInfo$', 'clearUser$');

  constructor() {
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getCollectionId = this.getCollectionId.bind(this);
    this.setCollectionId = this.setCollectionId.bind(this);
    this.getMuseumId = this.getMuseumId.bind(this);
    this.setMuseumId = this.setMuseumId.bind(this);
    this.getBuildNumber = this.getBuildNumber.bind(this);
    this.loadAppSession = this.loadAppSession.bind(this);
    this.__loadSession__ = this.__loadSession__.bind(this);
    const reducer$ = Observable.merge(
            this.__actions__.setAccessToken$.map(accessToken => state => ({...state, accessToken })),
            this.__actions__.clearUser$.do(clearAccessToken).map(() => (state) => ({...state, accessToken: null})),
            this.__actions__.loadBuildInfo$.filter(() => this.__state__.accessToken).switchMap(this.__loadSession__),
            this.__actions__.setMuseumId$.map(museumId => state => ({...state, museumId })),
            this.__actions__.setCollectionId$.map(collectionId => state => ({...state, collectionId }))
        );
    this.__store$__ = createStore(reducer$, Observable.of(this.__state__)).do(state => deepFreeze(state));
    this.__store$__.subscribe(
            (state) => this.__state__ = state,
            (error) => this.__error__ = error
        );
  }

  __loadSession__() {
    return Observable.forkJoin(
            ajaxGet(Config.magasin.urls.auth.buildInfo, this.__state__.accessToken),
            ajaxGet(Config.magasin.urls.actor.currentUser, this.__state__.accessToken),
            ajaxGet(Config.magasin.urls.auth.museumsUrl, this.__state__.accessToken)
        ).switchMap(([buildInfoRes, currentUserRes, museumsRes]) =>
            ajaxGet(Config.magasin.urls.auth.groupsUrl(currentUserRes.response.dataportenUser), this.__state__.accessToken)
                .map(({ response }) => (state) => {
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
                  return { ...state, actor: currentUserRes.response, groups, buildInfo: buildInfoRes.response };
                })
        );
  }

  getAccessToken() {
    return this.__state__.accessToken;
  }

  setAccessToken(token) {
    this.__actions__.setAccessToken$.next(token);
  }

  getMuseumId() {
    return this.__state__.museumId;
  }

  setMuseumId(mid) {
    this.__actions__.setMuseumId$.next(mid);
  }

  getCollectionId() {
    return this.__state__.collectionId;
  }

  setCollectionId(cid) {
    this.__actions__.setCollectionId$.next(cid);
  }

  loadAppSession() {
    this.__actions__.loadBuildInfo$.next();
  }

  getBuildNumber() {
    return this.__state__.buildInfo && this.__state__.buildInfo.buildInfoBuildNumber;
  }

  clearUser() {
    this.__actions__.clearUser$.next();
  }
}

const appSession = new AppSession();

export default appSession;