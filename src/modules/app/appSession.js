import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { simpleGet } from '../../shared/RxAjax';
import Config from '../../config';
import { getAccessToken } from '../../shared/token';
import { emitError } from '../../shared/errors';
import { getDisplayName } from '../../shared/util';
import { I18n } from 'react-i18nify';
import orderBy from 'lodash/orderBy';
import React from 'react';
import PropTypes from 'prop-types';
import isEqualWith from 'lodash/isEqualWith';
import { getLanguage } from './../../shared/language';

export const makeUrlAware = Component => {
  class Wrapper extends React.Component {
    static propTypes = {
      appSession: PropTypes.shape({
        museumId: PropTypes.number.isRequired,
        collectionId: PropTypes.string.isRequired
      }).isRequired,
      params: PropTypes.shape({
        museumId: PropTypes.string,
        collectionIds: PropTypes.string
      })
    };

    static defaultProps = {
      refreshSession: refreshSession()
    };

    componentWillMount() {
      this.diffPropsAndRefresh(this.props);
    }

    componentWillReceiveProps(newProps) {
      this.diffPropsAndRefresh(newProps);
    }

    diffPropsAndRefresh(newProps) {
      const paramsDiffFromSession = !isEqualWith(
        newProps.params,
        newProps.appSession,
        (params, session) => {
          return (
            params.museumId * 1 === session.museumId &&
            params.collectionIds === session.collectionId
          );
        }
      );
      if (paramsDiffFromSession) {
        this.props.refreshSession(newProps.params, newProps.appSession);
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  }
  Wrapper.displayName = `UrlAware(${getDisplayName(Component)})`;
  return Wrapper;
};

const initialState = { accessToken: getAccessToken() };

const loadAppSession = (ajaxGet = simpleGet, accessToken) => {
  accessToken = accessToken || getAccessToken();
  if (!accessToken) {
    return Observable.empty();
  }
  return Observable.forkJoin(
    ajaxGet(Config.magasin.urls.api.auth.buildInfo, accessToken),
    ajaxGet(Config.magasin.urls.api.actor.currentUser, accessToken),
    ajaxGet(Config.magasin.urls.api.auth.museumsUrl, accessToken)
  ).switchMap(([buildInfoRes, currentUserRes, museumsRes]) =>
    ajaxGet(
      Config.magasin.urls.api.auth.groupsUrl(currentUserRes.response.dataportenUser),
      accessToken
    ).map(({ response }) => {
      if (!response) {
        throw new Error(I18n.t('musit.errorMainMessages.noGroups'));
      }
      const isGod = !!response.find(group => 10000 === group.permission);
      let groups;
      if (isGod) {
        groups = museumsRes.response
          .filter(museum => 10000 !== museum.id)
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
      const orderedGroups = orderBy(groups, ['museumId'], ['desc']);
      const museumId = orderedGroups[0].museumId;
      const collectionId = orderedGroups[0].collections[0].uuid;
      return {
        accessToken,
        actor: currentUserRes.response,
        groups: orderedGroups,
        museumId,
        collectionId,
        buildInfo: buildInfoRes.response,
        language: {
          isEn: getLanguage() === 'en',
          isNo: getLanguage() === 'no'
        }
      };
    })
  );
};

export const loadAppSession$ = createAction('loadAppSession$').switchMap(loadAppSession);
export const setMuseumId$ = createAction('setMuseumId$');
export const setCollectionId$ = createAction('setCollectionId$');
export const setAccessToken$ = createAction('setAccessToken$');

export const refreshSession = (
  setMuseum = id => setMuseumId$.next(id),
  setCollection = id => setCollectionId$.next(id)
) => (params, appSession) => {
  const museumId = appSession.museumId;
  const museumIdFromParam = parseInt(params.museumId, 10);
  if (museumIdFromParam && museumIdFromParam !== museumId) {
    setMuseum(museumIdFromParam);
  }
  const collectionId = appSession.collectionId;
  const collectionIdFromParam = params.collectionIds;
  if (collectionIdFromParam && collectionIdFromParam !== collectionId) {
    setCollection(collectionIdFromParam);
  }
};

export const reducer$ = (actions, onError = emitError) =>
  Observable.merge(
    actions.setAccessToken$.map(accessToken => state => ({ ...state, accessToken })),
    actions.loadAppSession$
      .map(session => state => ({ ...state, ...session }))
      .catch(error => {
        onError(error);
        return Observable.of(state => ({ ...state, accessToken: null }));
      }),
    actions.setMuseumId$.map(museumId => state => ({ ...state, museumId })),
    actions.setCollectionId$.map(collectionId => state => ({ ...state, collectionId }))
  );

const session$ = (
  actions$ = { setMuseumId$, setCollectionId$, setAccessToken$, loadAppSession$ }
) => createStore('appSession', reducer$(actions$), Observable.of(initialState));

export default session$();
