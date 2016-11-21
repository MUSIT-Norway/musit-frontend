import {apiUrl} from '../../util';
import Actor from '../../models/actor';
import UserSession from '../../models/userSession';
import MuseumId from '../../models/museumId';

const ID = 'auth';

export const SET_USER = 'musit/auth/SET_USER';
export const CLEAR_USER = 'musit/auth/CLEAR_USER';
export const LOAD_ACTOR = 'musit/auth/LOAD_ACTOR';
export const LOAD_ACTOR_SUCCESS = 'musit/auth/LOAD_ACTOR_SUCCESS';
export const LOAD_ACTOR_FAILURE = 'musit/auth/LOAD_ACTOR_FAILURE';
export const CLEAR_ACTOR = 'musit/auth/CLEAR_ACTOR';

const initialState = {
  user: {}
};

const authReducer = (state = initialState, action = {}) => {
  switch (action.type) {
  case SET_USER:
    return {
      ...state,
      user: new UserSession(action.accessToken, new MuseumId(99), null, null)
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
    const user = state.user;
    return {
      ...state,
      loading: false,
      loaded: true,
      user: new UserSession(user.accessToken, user.museumId, user.groups, new Actor(action.result))
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

export const loadActor = () => {
  return {
    types: [LOAD_ACTOR, LOAD_ACTOR_SUCCESS, LOAD_ACTOR_FAILURE],
    promise: (client) => client.get(apiUrl('/api/actor/v1/dataporten/currentUser'))
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

export const clearUser = () => {
  return {
    type: CLEAR_USER
  };
};

export const getMuseumId = () => {
  return global.reduxStore.getState()[ID].user.museumId.id;
};
