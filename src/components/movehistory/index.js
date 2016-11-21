import MoveHistoryModal from './MoveHistoryModal';
import { loadMoveHistoryForObject, clearMoveHistoryForObject } from '../../reducers/grid/move';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    moves: state.movehistory.data || [],
    user: state.auth.user
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
