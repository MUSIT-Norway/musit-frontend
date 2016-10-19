import { omit } from 'lodash'

import * as types from './constants'

const initialState = {
  data: [
    {
      museumNo: '12345',
      subNo: '45',
      term: 'Fuglekasse',
      id: 1,
      path: ',1,2,3,',
      pathNames: [
        {
          nodeId: 1,
          name: "Root",
          type: "Organization"
        },
        {
          nodeId: 2,
          name: "Musit",
          type: "Building"
        },
        {
          nodeId: 3,
          name: "Kontoret",
          type: "Room"
        }
      ]
    },
    {
      museumNo: '12',
      subNo: '46',
      term: 'Stol',
      id: 2,
      path: ',1,2,3,',
      pathNames: [
        {
          nodeId: 1,
          name: "Root",
          type: "Organization"
        },
        {
          nodeId: 2,
          name: "Musit",
          type: "Building"
        },
        {
          nodeId: 3,
          name: "Kontoret",
          type: "Room"
        }
      ]
    },
    {
      museumNo: '123',
      subNo: '48',
      term: 'Kasse',
      id: 3,
      path: ',1,2,3,',
      pathNames: [
        {
          nodeId: 1,
          name: "Root",
          type: "Organization"
        },
        {
          nodeId: 2,
          name: "Musit",
          type: "Building"
        },
        {
          nodeId: 3,
          name: "Kontoret",
          type: "Room"
        }
      ]
    }
  ],
  params: {

  }
}

export default (state = initialState, action) => {
  switch(action.type) {
    case types.CHANGE_FIELD:
      return {
        ...state,
        params: {
          ...state.params,
          [action.field]: action.value
        }
      }
    case types.SEARCH_OBJECTS:
      return {
        ...omit(state, 'error'),
        loading: true,
        loaded: false,
        data: []
      }
    case types.SEARCH_OBJECTS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: [],
        error: action.error
      }
    case types.SEARCH_OBJECTS_SUCCESS:
      return {
        ...omit(state, 'error'),
        loading: false,
        loaded: true,
        data: action.result
      }
    default:
      return state;
  }
}