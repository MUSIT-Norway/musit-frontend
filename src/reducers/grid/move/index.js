/* @flow */
const LOAD = 'musit/movehistory/LOAD'
const LOAD_SUCCESS = 'musit/movehistory/LOAD_SUCCESS'
const LOAD_FAIL = 'musit/movehistory/LOAD_FAIL'
const LOAD_ACTOR = 'musit/movehistory/LOAD_ACTOR'
const LOAD_ACTOR_SUCCESS = 'musit/movehistory/LOAD_ACTOR_SUCCESS'
const LOAD_ACTOR_FAIL = 'musit/movehistory/LOAD_ACTOR_FAIL'
const CLEAR = 'musit/movehistory/CLEAR_SUCCESS'
const CLEAR_SUCCESS = 'musit/movehistory/CLEAR'
const CLEAR_FAIL = 'musit/movehistory/CLEAR_FAIL'

const initialState = { data:
[
  {
    doneBy: 2,
    doneDate: '2016-10-06T00:00:00+00:00',
    registeredBy: 'Darth Vader',
    registeredDate: '2016-10-06T05:55:52+00:00',
    from: {
      path: ',1,2,3,6,7,',
      pathNames: [
        {
          name: 'root-node',
          nodeId: 1
        },
        {
          name: 'Utviklingsmuseet',
          nodeId: 2
        },
        {
          name: 'Forskningens hus',
          nodeId: 3
        },
        {
          name: 'Forskningsværelset',
          nodeId: 6
        },
        {
          name: 'Foo',
          nodeId: 7
        }
      ]
    },
    to: {
      path: ',1,2,3,6,',
      pathNames: [
        {
          name: 'root-node',
          nodeId: 1
        },
        {
          name: 'Utviklingsmuseet',
          nodeId: 2
        },
        {
          name: 'Forskningens hus',
          nodeId: 3
        },
        {
          name: 'Forskningsværelset',
          nodeId: 6
        }
      ]
    }
  }]
}

const moveHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.error

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
        data: state.data.map((e) => {
          const actor = action.result.find((a) => a.id === e.doneBy);
          return { ...e,
            doneBy: actor ? actor.fn : e.doneBy
          }
        })
      };
    case LOAD_ACTOR_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: { ...state.data, actor: action.error }
      }
    case CLEAR_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: action.result
      }
    case CLEAR:
      return {
        ...state,
        loading: true,
        loaded: false
      }
    case CLEAR_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      }
    default:
      return state;
  }
}

export default moveHistoryReducer;


export const loadActor = (r) => {
  console.log(r)
  return {
    types: [LOAD_ACTOR, LOAD_ACTOR_SUCCESS, LOAD_ACTOR_FAIL],
    promise: (client) => client.post('/api/actor/v1/person/details', r)
  }
}

export const loadMoveHistoryForObject = (id, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/api/storagefacility/v1/storagenodes/objects/${id}/locations`),
    callback
  }
}

export const clearMoveHistoryForObject = () => {
  return {
    type: CLEAR_SUCCESS,
    result: []
  }
}
