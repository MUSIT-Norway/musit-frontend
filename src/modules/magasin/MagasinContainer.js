import { connect } from 'react-redux';
import * as actions from './magasinActions';
import selector from './magasinSelectors';
import { addNode, addObject } from '../picklist/picklistActions';
import StorageUnitsContainer from './MagasinComponent';
import MoveDialog from '../moveDialog/index';
const { moveObject, moveNode, clear } = MoveDialog.actions;

const mapStateToProps = (state) => ({
  user: state.app.user,
  ...selector(state.magasin)
});

const mapDispatchToProps = {
  loadRoot: actions.loadRoot,
  loadObjects: actions.loadObjects,
  loadChildren: actions.loadChildren,
  moveObject: moveObject,
  moveNode: moveNode,
  loadMainObject: actions.loadMainObject,
  addNode: addNode,
  addObject: addObject,
  deleteUnit: actions.deleteUnit,
  loadStats: actions.loadStats,
  clearRoot: actions.clearRoot,
  clearStats: actions.clearStats,
  clearMoveDialog: clear
};

export default connect(mapStateToProps, mapDispatchToProps)(StorageUnitsContainer);
