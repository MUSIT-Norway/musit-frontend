import { connect } from 'react-redux';
import { insert } from './storageActions';
import AddNode from './StorageAddComponent';
import { clearState, updateState } from './storageActions';
import Magasin from '../magasin/index';

const { loadRoot } = Magasin.actions;
const { rootNodeSelector } = Magasin.selectors;

const mapStateToProps = (state) => ({
  user: state.app.user,
  unit: state.storage.state,
  rootNode: rootNodeSelector(state.magasin)
});

const mapDispatchToProps = {
  onLagreClick: insert,
  updateState,
  clearState,
  loadStorageObj: loadRoot
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNode);
