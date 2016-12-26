import { connect } from 'react-redux';
import ViewObservationPage from '../../components/observation/view';
import { loadObservation } from '../../reducers/observation';
import { actions, rootNodeSelector } from '../../magasin';
const { loadRoot } = actions;

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    doneBy: state.observation.data.doneBy,
    doneDate: state.observation.data.doneDate,
    registeredDate: state.observation.data.registeredDate,
    registeredBy: state.observation.data.registeredBy,
    observations: state.observation.data.observations,
    rootNode: rootNodeSelector(state.magasinReducers)
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
