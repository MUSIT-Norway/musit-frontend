import {apiUrl} from '../../util';
import Actor from '../../models/actor';
import MuseumId from '../../models/museumId';
import Config from '../../config';
import UserSession from '../../models/userSession';

const ID = 'auth';

export const SET_USER = 'musit/auth/SET_USER';
export const SET_MUSEUMID = 'musit/auth/SET_MUSEUMID';
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
      user: new UserSession(action.accessToken, null, null, null)
    };
  case SET_MUSEUMID:
    return {
      ...state,
      user: new UserSession(
        user.accessToken,
        new MuseumId(action.museumId),
        user.groups,
        user.actor
      )
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
      user: new UserSession(
        user.accessToken,
        new MuseumId(allGroups[0].museumId),
        allGroups,
        new Actor(action.result)
      )
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
    promise: (client) => new Promise((resolve) => {
      client.get(apiUrl(Config.magasin.urls.actor.currentUser))
       .then(user =>
         client.get(apiUrl(Config.magasin.urls.auth.groupsUrl(user.dataportenUser)))
           .then(maybeGroups => {
             const groups = [].concat(maybeGroups).filter(m => m);
             if (groups.length > 0 && !groups.find(museum => ALL_MUSEUMS === museum.museumId)) {
               resolve({ ...user, groups });
             } else {
               client.get(apiUrl(Config.magasin.urls.auth.museumsUrl))
                 .then(museums => {
                   resolve({
                     ...user,
                     groups: museums
                       .filter(museum => ALL_MUSEUMS !== museum.id)
                       .map(museum => ({
                         ...museum,
                         museumId: museum.id
                       }))
                   });
                 });
             }
           })
       );
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
