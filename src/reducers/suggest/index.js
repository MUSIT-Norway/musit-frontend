
export const CLEAR = 'musit/suggest/CLEAR';
export const SUGGEST = 'musit/suggest/LOAD';
export const SUGGEST_SUCCESS = 'musit/suggest/LOAD_SUCCESS';
export const SUGGEST_FAIL = 'musit/suggest/LOAD_FAIL';
import { apiUrl } from '../../util';

const initialState = {
};

const suggestionReducer = (state = initialState, action = {}) => {
  const subState = state[action.destination];
  const subStateKey = action.destination;

  switch (action.type) {
  case CLEAR: {
    return initialState;
  }
  case SUGGEST:
    return {
      ...state,
      [subStateKey]: {
        ...subState,
        loading: true
      }
    };
  case SUGGEST_SUCCESS:
    return {
      ...state,
      [subStateKey]: {
        ...subState,
        loading: false,
        loaded: true,
        data: action.result
      }
    };
  case SUGGEST_FAIL:
    return {
      ...state,
      [subStateKey]: {
        ...subState,
        loading: false,
        loaded: false,
        error: action.error
      }
    };
  default:
    return state;
  }
};

export default suggestionReducer;

export const clearSuggest = (destination) => {
  return {
    type: CLEAR,
    destination
  };
};

export const suggestAddress = (destination, query) => {
  return {
    types: [SUGGEST, SUGGEST_SUCCESS, SUGGEST_FAIL],
    destination,
    promise: (client) => client.get(apiUrl(`/api/geolocation/v1/address?search=[${query}]`))
  };
};

export const suggestNode = (destination, query) => {
  return {
    types: [SUGGEST, SUGGEST_SUCCESS, SUGGEST_FAIL],
    destination,
    promise: (client) => client.get(apiUrl(`/api/storagefacility/v1/museum/1/storagenod/search?searchStr=${query}`))
  };
};

export const suggestPerson = (destination, query) => {
  return {
    types: [SUGGEST, SUGGEST_SUCCESS, SUGGEST_FAIL],
    destination,
    promise: (client) => client.get(apiUrl(`/api/actor/v1/person?search=[${query}]&museumId=1`))
  };
};
