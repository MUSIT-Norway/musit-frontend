import MoveHistoryModal from './MoveHistoryModal';
import { loadMoveHistoryForObject, clearMoveHistoryForObject } from './moveHistoryReducer';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    moves: [].concat(state.movehistory.data)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadMoveHistoryForObject: (objectId, museumId, cb) => {
      dispatch(loadMoveHistoryForObject(objectId, museumId, cb));
    },
    clearMoveHistoryForObject: (objectId, museumId) => {
      dispatch(clearMoveHistoryForObject(objectId, museumId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveHistoryModal);
