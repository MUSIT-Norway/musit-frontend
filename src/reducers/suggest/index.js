
export const CLEAR = 'musit/suggest/CLEAR'
export const SUGGEST = 'musit/suggest/LOAD'
export const SUGGEST_SUCCESS = 'musit/suggest/LOAD_SUCCESS'
export const SUGGEST_FAIL = 'musit/suggest/LOAD_FAIL'

const initialState = {
}

const suggestionReducer = (state = initialState, action = {}) => {
  const subState = state[action.destination]
  const subStateKey = action.destination

  switch (action.type) {
    case CLEAR: {
      let retVal = initialState
      if (subStateKey && subStateKey.length > 0) {
        retVal = {
          ...state,
          [subStateKey]: {
            loading: false,
            loaded: false
          }
        }
      }
      return retVal
    }
    case SUGGEST:
      return {
        ...state,
        [subStateKey]: {
          ...subState,
          loading: true
        }
      }
    case SUGGEST_SUCCESS:
      return {
        ...state,
        [subStateKey]: {
          ...subState,
          loading: false,
          loaded: true,
          data: action.result
        }
      }
    case SUGGEST_FAIL:
      return {
        ...state,
        [subStateKey]: {
          ...subState,
          loading: false,
          loaded: false,
          error: action.error
        }
      }
    default:
      return state
  }
}

export default suggestionReducer

export const clearSuggest = (destination) => {
  return {
    type: CLEAR,
    destination
  }
}

export const suggestAddress = (destination, query) => {
  return {
    types: [SUGGEST, SUGGEST_SUCCESS, SUGGEST_FAIL],
    destination,
    promise: (client) => client.get(`/api/geolocation/v1/address?search=[${query}]`)
  }
}

export const suggestNode = (destination, query) => {
  return {
    types: [SUGGEST, SUGGEST_SUCCESS, SUGGEST_FAIL],
    destination,
    promise: (client) => client.get(`/api/storagefacility/v1/museum/1/storagenodes/search?searchStr=${query}`)
  }
}

export const suggestPerson = (destination, query) => {
  return {
    types: [SUGGEST, SUGGEST_SUCCESS, SUGGEST_FAIL],
    destination,
    promise: (client) => client.get(`/api/actor/v1/person?search=[${query}]&museumId=1`)
  }
}
