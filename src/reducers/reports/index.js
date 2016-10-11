/* @flow */
const LOAD_KD_REPORT = 'musit/reports/LOAD_KD_REPORT'
const LOAD_KD_REPORT_FAIL = 'musit/reports/LOAD_KD_REPORT_FAIL'
const LOAD_KD_REPORT_SUCESS = 'musit/reports/LOAD_KD_REPORT_SUCESS'

const initialState = {

  data: {
    kdreport: {
      data: {}
    }
  }
}

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_KD_REPORT: {
      return {
        ...state,
        loading: true,
        loaded: false
      }
    }
    case LOAD_KD_REPORT_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
        data: { ...state.data, kdreport: { ...state.data.kdreport, data: action.error } }
      }
    }
    case LOAD_KD_REPORT_SUCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        data: { ...state.data, kdreport: { ...state.data.kdreport, data: action.result } }
      }
    }
    default:
      return state
  }
}

export default reportReducer


export const loadKDReport = (cb) => {
  return {
    types: [LOAD_KD_REPORT, LOAD_KD_REPORT_SUCESS, LOAD_KD_REPORT_FAIL],
    promise: (client) => client.get('/api/storagefacility/v1/storagenodes/report'),
    cb
  };
}
