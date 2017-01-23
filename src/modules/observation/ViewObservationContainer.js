import { connect } from 'react-redux';
import ViewObservationPage from './ViewObservationPage';
import { loadObservation } from './observationReducer';
import { loadRoot } from '../storagefacility/reducers/grid/nodes';

const mapStateToProps = (state) => {
  return {
    doneBy: state.observation.data.doneBy,
    doneDate: state.observation.data.doneDate,
    registeredDate: state.observation.data.registeredDate,
    registeredBy: state.observation.data.registeredBy,
    observations: state.observation.data.observations,
    rootNode: state.storageGridUnit.root.data
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadObservation: (nodeId, observationId, museumId, callback) => {
      dispatch(loadObservation(nodeId, observationId, museumId, callback));
    },
    loadStorageObj: (id, museumId) => {
      dispatch(loadRoot(id, museumId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewObservationPage);
