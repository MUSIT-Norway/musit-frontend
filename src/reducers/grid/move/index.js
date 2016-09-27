const LOAD = 'musit/movehistory/LOAD'
const LOAD_SUCCESS = 'musit/movehistory/LOAD_SUCCESS'
const LOAD_FAIL = 'musit/movehistory/LOAD_FAIL'

const initialState = { data: [
  { doneBy: 'Kjell Kjellstad',
    doneDate: '23.12.2001',
    from: { path: 'NHM/3etg/Rom 3/Skap 4/Skuff 4/Eske 3' },
    to: { path: 'NHM/3etg/Rom 3/Skap 2/Skuff 1/Eske 8' }
  },
  { doneBy: 'Bjørn Bjørnsen',
    doneDate: '21.12.2005',
    from: { path: 'NHM/1 etg/Rom 4/Skap 14/Skuff 1/Eske 10' },
    to: { path: 'NHM/3 etg/Rom 1/Skap 6/Skuff 4/Eske 18' }
  }
] }

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
