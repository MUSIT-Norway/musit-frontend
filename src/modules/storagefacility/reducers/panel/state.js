
import { mapToFrontend } from '../../../../models/mapper';
const UPDATE = 'musit/storageunit-panel-state/UPDATE';
const CLEAR = 'musit/storageunit-panel-state/CLEAR';

const storageUnitPanelStateReducer = (state = {
  environmentRequirement: {},
  environmentAssessment: {},
  securityAssessment: {}
}, action = {}) => {
  switch (action.type) {
  case UPDATE:
    return Object.assign({}, action.data);
  case CLEAR:
    return {
      environmentRequirement: {},
      environmentAssessment: {},
      securityAssessment: {}
    };
  default:
    return state;
  }
};

export default storageUnitPanelStateReducer;

export const update = (data) => {
  return {
    type: UPDATE,
    data: mapToFrontend(data)
  };
};

export const clear = () => {
  return {
    type: CLEAR
  };
};
