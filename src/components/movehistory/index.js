import MoveHistoryModal from './MoveHistoryModal';
import { loadMoveHistoryForObject, clearMoveHistoryForObject, loadActor } from '../../reducers/grid/move';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    moves: state.movehistory.data || []
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadMoveHistoryForObject: (objectId, cb) => {
      dispatch(loadMoveHistoryForObject(objectId, cb));
    },
    clearMoveHistoryForObject: (objectId) => {
      dispatch(clearMoveHistoryForObject(objectId));
    },
    loadActorDetails: (data) => {
      dispatch(loadActor(data));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveHistoryModal);
