const LOAD = 'musit/movehistory/LOAD'
const LOAD_SUCCESS = 'musit/movehistory/LOAD_SUCCESS'
const LOAD_FAIL = 'musit/movehistory/LOAD_FAIL'

const initialState = { data: [] }

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
        loaded: false,
        error: action.error
      }
    default:
      return state;
  }
}

export default moveHistoryReducer;

export const loadMoveHistoryForObject = () => {
  return {
    type: LOAD_SUCCESS,
    result: initialState.data
  }
}
