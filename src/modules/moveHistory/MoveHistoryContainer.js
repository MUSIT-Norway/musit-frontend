import MoveHistoryModal from './MoveHistoryModal';
import { loadMoveHistoryForObject, clearMoveHistoryForObject } from './moveHistoryReducers';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  moves: [].concat(state.moveHistory.data),
  user: state.app.user
});

const mapDispatchToProps = {
  loadMoveHistoryForObject,
  clearMoveHistoryForObject
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveHistoryModal);
