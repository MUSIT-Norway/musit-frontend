import {apiUrl} from '../../util';
import Config from '../../config';
import Actor from '../../models/actor';
import MuseumId from '../../models/museumId';
import CollectionId from '../../models/collectionId';

const ID = 'auth';

export const SET_USER = 'musit/auth/SET_USER';
export const SET_MUSEUMID = 'musit/auth/SET_MUSEUMID';
export const SET_COLLECTIONID = 'musit/auth/SET_COLLECTIONID';
export const CLEAR_USER = 'musit/auth/CLEAR_USER';
export const LOAD_ACTOR = 'musit/auth/LOAD_ACTOR';
export const LOAD_ACTOR_SUCCESS = 'musit/auth/LOAD_ACTOR_SUCCESS';
export const LOAD_ACTOR_FAILURE = 'musit/auth/LOAD_ACTOR_FAILURE';
export const CLEAR_ACTOR = 'musit/auth/CLEAR_ACTOR';

const initialState = {
  user: {}
};

const authReducer = (state = initialState, action = {}) => {
  const user = state.user;
  switch (action.type) {
  case SET_USER:
    return {
      ...state,
      user: {
        accessToken: action.accessToken
      }
    };
  case SET_MUSEUMID:
    return {
      ...state,
      user: {
        ...user,
        museumId: new MuseumId(action.museumId)
      }
    };
  case SET_COLLECTIONID:
    return {
      ...state,
      user: {
        ...user,
        collectionId: new CollectionId(action.collectionId)
      }
    };
  case CLEAR_USER:
    return {
      ...state,
      user: {}
    };
  case LOAD_ACTOR:
    return {
      ...state,
      loading: true,
      loaded: false
    };
  case LOAD_ACTOR_SUCCESS:
    const allGroups = action.result.groups;
    return {
      ...state,
      loading: false,
      loaded: true,
      user: {
        ...user,
        actor: new Actor(action.result),
        museumId: new MuseumId(allGroups[0].museumId),
        collectionId: new CollectionId(allGroups[0].collections[0].uuid),
        groups: allGroups
      }
    };
  case LOAD_ACTOR_FAILURE:
    return {
      ...state,
      loading: false,
      loaded: false,
      error: action.error
    };
  default:
    return state;
  }
};

export default { ID, reducer: authReducer };

const ALL_MUSEUMS = 10000;

export const loadActor = (callback) => {
  return {
    types: [LOAD_ACTOR, LOAD_ACTOR_SUCCESS, LOAD_ACTOR_FAILURE],
    promise: (client) => new Promise((resolve, reject) => {
      client.get(apiUrl(Config.magasin.urls.actor.currentUser))
       .then(user =>
         Promise.all([
           client.get(apiUrl(Config.magasin.urls.auth.groupsUrl(user.dataportenUser))),
           client.get(apiUrl(Config.magasin.urls.auth.museumsUrl))
         ]).then(values => {
           const maybeGroups = values[0];
           const museums = values[1];
           const groups = maybeGroups.filter(m => m);
           const maybeGodGroup = groups.find(museum => ALL_MUSEUMS === museum.museumId);
           if (groups.length > 0 && !maybeGodGroup) {
             resolve({
               ...user,
               groups: groups.map(group => ({
                 ...group,
                 museumName: museums.find(m => m.id === group.museumId).shortName
               }))
             });
           } else {
             resolve({
               ...user,
               groups: museums.filter(museum => ALL_MUSEUMS !== museum.id)
                 .map(museum => ({
                   ...museum,
                   museumId: museum.id,
                   museumName: museum.shortName,
                   collections: maybeGodGroup.collections
                 }))
             });
           }
         }).catch(error => reject(error))
       ).catch(error => reject(error));
    }),
    callback
  };
};

export const clearActor = () => {
  return {
    type: CLEAR_ACTOR
  };
};

export const setUser = (user) => {
  return {
    type: SET_USER,
    accessToken: user.accessToken
  };
};

export const setMuseumId = (museumId) => {
  return {
    type: SET_MUSEUMID,
    museumId
  };
};

export const setCollectionId = (collectionId) => {
  return {
    type: SET_COLLECTIONID,
    collectionId
  };
};

export const clearUser = () => {
  return {
    type: CLEAR_USER
  };
};

const getStateField = (field) => {
  return global.reduxStore.getState()[ID].user[field];
};

export const getMuseumId = () => {
  return getStateField('museumId');
};

export const getAccessToken = () => {
  return getStateField('accessToken');
};
