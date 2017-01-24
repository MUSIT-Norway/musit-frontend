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

const loadAppSession = (accessToken = initialState.accessToken) => {
  return Observable.forkJoin(
    ajaxGet(Config.magasin.urls.auth.buildInfo, accessToken),
    ajaxGet(Config.magasin.urls.actor.currentUser, accessToken),
    ajaxGet(Config.magasin.urls.auth.museumsUrl, accessToken)
  ).switchMap(([buildInfoRes, currentUserRes, museumsRes]) =>
    ajaxGet(Config.magasin.urls.auth.groupsUrl(currentUserRes.response.dataportenUser), accessToken)
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
};

export const actions = createActions('setMuseumId$', 'setCollectionId$', 'setAccessToken$', 'loadAppSession$');

export const reducer$ = ({ setMuseumId$, setCollectionId$, setAccessToken$, loadAppSession$}) => Observable.merge(
  setAccessToken$
    .map(accessToken => state => ({...state, accessToken})),
  loadAppSession$
    .switchMap(loadAppSession)
    .map(session => state => ({...state, ...session}))
    .catch(error => {
      emitError(error);
      return Observable.of(state => ({...state, accessToken: null}));
    }),
  setMuseumId$
    .map(museumId => state => ({...state, museumId})),
  setCollectionId$
    .map(collectionId => state => ({...state, collectionId}))
);

const store$ = createStore(reducer$(actions), Observable.of(initialState)).map(state => new AppSession(state));

export default store$;

CodeReceiver(store$);
