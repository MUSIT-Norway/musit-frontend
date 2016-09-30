const LOAD_REPORTS = 'musit/reports/LOAD_REPORTS'
const LOAD_REPORTS_FAIL = 'musit/reports/LOAD_REPORTS_FAIL'
const LOAD_REPORTS_SUCCESS = 'musit/reports/LOAD_REPORTS_SUCCESS'
const LOAD_KD_REPORT = 'musit/reports/LOAD_KD_REPORT'
const LOAD_KD_REPORT_FAIL = 'musit/reports/LOAD_KD_REPORT_FAIL'
const LOAD_KD_REPORT_SUCESS = 'musit/reports/LOAD_KD_REPORT_SUCESS'

const initialState = {
  kdreport: {
    title: 'Sikringstilstand',
    url: '/#/reports/kdreport',
    description: 'Sikringstilstand',
    data: {}
  },
  kadreport: {}
}

const reportReducer = (state, action) => {
  switch (action.type) {
    case LOAD_REPORTS: {
      return {
        ...state,
        loading: true,
        loaded: false
      }
    }
    case LOAD_REPORTS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
        data: action.error
      }
    }
    case LOAD_REPORTS_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      }
    }
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
        data: action.error
      }
    }
    case LOAD_KD_REPORT_SUCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        data: { ...state.data,
               kdreport: { ...state.data.kdreport, data: action.result
            }
        }
      }
    }
    default: {
      return { ...state }
    }
  }
}

export default reportReducer

export const loadReports = () => {
  return {
    type: LOAD_REPORTS_SUCCESS,
    result: initialState
  };
}

export const loadKDReports = () => {
  return {
    types: [LOAD_KD_REPORT, LOAD_KD_REPORT_SUCESS, LOAD_KD_REPORT_FAIL],
    promise: (client) => client.get('/api/storagefacility/v1/storagenodes/report')
  };
}
