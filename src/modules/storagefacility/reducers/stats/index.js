import Config from '../../../../config';
import { apiUrl } from '../../../../util';

export const LOAD_STATS = 'musit/strageunit-stats/LOAD_STATS';
export const LOAD_STATS_SUCCESS = 'musit/strageunit-stats/LOAD_STATS_SUCCESS';
export const LOAD_STATS_FAILURE = 'musit/strageunit-stats/LOAD_STATS_FAILURE';
export const CLEAR_STATS = 'musit/strageunit-stats/CLEAR_STATS';

const initialState = {
  stats: {
    nodes: null,
    objects: null,
    totalObjects: null
  }
};

const storageUnitStatsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
  case CLEAR_STATS:
    return {
      ...state,
      stats: null
    };
  case LOAD_STATS:
    return {
      ...state,
      stats: null,
      loading: true,
      loaded: false
    };
  case LOAD_STATS_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      stats: action.result
    };
  case LOAD_STATS_FAILURE:
    return {
      ...state,
      stats: null,
      loading: false,
      loaded: false,
      error: action.error
    };
  default:
    return state;
  }
};

export default storageUnitStatsReducer;

export const loadStats = (id, museumId) => {
  return {
    types: [LOAD_STATS, LOAD_STATS_SUCCESS, LOAD_STATS_FAILURE],
    promise: (client) => client.get(apiUrl(`${Config.magasin.urls.thingaggregate.baseUrl(museumId)}/storagenodes/${id}/stats`))
  };
};

export const clearStats = () => {
  return {
    type: CLEAR_STATS
  };
};
