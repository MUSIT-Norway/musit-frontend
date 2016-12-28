import MoveHistoryModal from './MoveHistoryModal';
import { loadMoveHistoryForObject, clearMoveHistoryForObject } from './moveHistoryReducers';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    moves: [].concat(state.moveHistory.data),
    user: state.app.user
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
