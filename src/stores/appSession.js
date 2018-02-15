import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { simpleGet } from '../shared/RxAjax';
import Config from '../config';
import { getAccessToken } from '../shared/token';
import { emitError } from '../shared/errors';
import { getDisplayName } from '../shared/util';
import { I18n } from 'react-i18nify';
import orderBy from 'lodash/orderBy';
import React from 'react';
import PropTypes from 'prop-types';
import isEqualWith from 'lodash/isEqualWith';
import { getLanguage } from '../shared/language';
import { KEEP_ALIVE } from './constants';

export const makeUrlAware = Component => {
  class Wrapper extends React.Component {
    static propTypes = {
      appSession: PropTypes.shape({
        museumId: PropTypes.number.isRequired,
        collectionId: PropTypes.string.isRequired
      }).isRequired,
      match: PropTypes.shape({
        params: PropTypes.shape({
          museumId: PropTypes.string,
          collectionIds: PropTypes.string
        })
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
      const newParams = this.getParams(newProps);
      const routerMatchDiffFromSession = this.isRouterMatchDifferentFromSession(
        newParams,
        newProps.appSession
      );
      if (routerMatchDiffFromSession) {
        this.props.refreshSession(newParams, newProps.appSession);
      }
    }

    getParams(newProps) {
      return (newProps.match && newProps.match.params) || {};
    }

    isRouterMatchDifferentFromSession(newParams, appSession) {
      return !isEqualWith(
        newParams,
        appSession,
        (params, session) =>
          params.museumId * 1 === session.museumId &&
          params.collectionIds === session.collectionId
      );
    }

    render() {
      if (
        this.isRouterMatchDifferentFromSession(
          this.getParams(this.props),
          this.props.appSession
        )
      ) {
        return <div className="loading" />;
      }
      return <Component {...this.props} />;
    }
  }
  Wrapper.displayName = `UrlAware(${getDisplayName(Component)})`;
  return Wrapper;
};

const rolesForModules = {
  collectionManagementRead: true,
  collectionManagementWrite: true,
  storageFacilityRead: true,
  storageFacilityWrite: true,
  documentArchiveRead: true,
  documentArchiveWrite: true
};

const initialState = {
  accessToken: getAccessToken(),
  rolesForModules: rolesForModules
};

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
      setRolesForModules$.next({
        email: currentUserRes.response.dataportenUser,
        museumId: museumId,
        collectionId: collectionId,
        isGod: isGod
      });
      return {
        accessToken,
        actor: currentUserRes.response,
        groups: orderedGroups,
        isGod: !!isGod,
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

const getRolesForModules = (props: {
  email: string,
  museumId: number,
  collectionId: string,
  isGod: boolean
}) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return Observable.empty();
  }
  if (props.isGod) {
    return Observable.of(
      {
        collectionManagementRead: true,
        collectionManagementWrite: true,
        storageFacilityRead: true,
        storageFacilityWrite: true,
        documentArchiveRead: true,
        documentArchiveWrite: true
      }
      /*
      [
      {
          "module": "Document Archive",
          "moduleId": 3,
          "role": "Admin",
          "roleId": 30
      },
      {
          "module": "Storage Facility",
          "moduleId": 1,
          "role": "Admin",
          "roleId": 30
      },
      {
          "module": "Collection Management",
          "moduleId": 2,
          "role": "Admin",
          "roleId": 30
      }
  ]
  */
    );
  } else {
    return simpleGet(
      Config.magasin.urls.api.auth.rolesUrl(
        props.email,
        props.museumId,
        props.collectionId
      ),
      accessToken
    ).map(({ response }) => {
      let collectionManagementRead = false;
      let collectionManagementWrite = false;
      let storageFacilityRead = false;
      let storageFacilityWrite = false;
      let documentArchiveRead = false;
      let documentArchiveWrite = false;

      response &&
        response.map(r => {
          if (r.module && r.roleId) {
            const read = r.roleId >= 10; // read role for 10, 20, 30 and 40
            const write = r.roleId > 10; // write role for 20, 30 and 40

            if (r.module === 'Collection Management') {
              collectionManagementRead = read;
              collectionManagementWrite = write;
            }

            if (r.module === 'Storage Facility') {
              storageFacilityRead = read;
              storageFacilityWrite = write;
            }

            if (r.module === 'Document Archive') {
              documentArchiveRead = read;
              documentArchiveWrite = write;
            }
          }
        });

      return {
        collectionManagementRead: collectionManagementRead,
        collectionManagementWrite: collectionManagementWrite,
        storageFacilityRead: storageFacilityRead,
        storageFacilityWrite: storageFacilityWrite,
        documentArchiveRead: documentArchiveRead,
        documentArchiveWrite: documentArchiveWrite
      };
    });
  }
};

export const loadAppSession$ = createAction('loadAppSession$').switchMap(loadAppSession);
export const setMuseumId$ = createAction('setMuseumId$');
export const setCollectionId$ = createAction('setCollectionId$');
export const setAccessToken$ = createAction('setAccessToken$');
export const setRolesForModules$ = createAction('setRolesForModules$').switchMap(
  getRolesForModules
);

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
  setRolesForModules$.next({
    email: appSession.actor.dataportenUser,
    museumId: museumIdFromParam,
    collectionId: collectionIdFromParam,
    isGod: appSession.isGod
  });
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
    actions.setCollectionId$.map(collectionId => state => ({ ...state, collectionId })),
    actions.setRolesForModules$
      .map(rolesForModules => state => ({ ...state, rolesForModules: rolesForModules }))
      .catch(error => {
        onError(error);
        return Observable.of(state => ({ ...state }));
      })
  );

const session$ = (
  actions$ = {
    setMuseumId$,
    setCollectionId$,
    setAccessToken$,
    loadAppSession$,
    setRolesForModules$
  }
) => createStore('appSession', reducer$(actions$), initialState, KEEP_ALIVE);

const store$ = session$();

export default store$;
