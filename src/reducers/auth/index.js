import { apiUrl } from '../../util';
import { getActorId } from '../../util/actor';

export const SET_USER = 'musit/auth/SET_USER';
export const CLEAR_USER = 'musit/auth/CLEAR_USER';
export const LOAD_ACTOR = 'musit/auth/LOAD_ACTOR';
export const LOAD_ACTOR_SUCCESS = 'musit/auth/LOAD_ACTOR_SUCCESS';
export const LOAD_ACTOR_FAILURE = 'musit/auth/LOAD_ACTOR_FAILURE';
export const CLEAR_ACTOR = 'musit/auth/CLEAR_ACTOR';

const initialState = {
  user: null,
  actor: null
};

const authReducer = (state = initialState, action = {}) => {
  switch (action.type) {
  case SET_USER:
    return {
      ...state,
      user: action.user
    };
  case CLEAR_USER:
    return {
      ...state,
      user: null
    };
  case CLEAR_ACTOR:
    return {
      ...state,
      actor: null
    };
  case LOAD_ACTOR:
    return {
      ...state,
      loading: true,
      loaded: false
    };
  case LOAD_ACTOR_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      actor: action.result,
      actorId: getActorId(action.result)
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

export default authReducer;

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

export const connectUser = (user) => {
  return {
    type: SET_USER,
    user: user
  };
};

export const clearUser = () => {
  return {
    type: CLEAR_USER
  };
};
