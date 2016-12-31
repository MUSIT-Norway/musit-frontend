import { connect } from 'react-redux';
import { load, update } from './storageActions';
import EditNode from './StorageEditComponent';
import { updateState } from './storageActions';
import Magasin from '../magasin/index';

const { loadRoot } = Magasin.actions;
const { rootNodeSelector } = Magasin.selectors;

const mapStateToProps = (state) => ({
  user: state.app.user,
  unit: state.storage.state,
  loaded: !!state.storage.loaded,
  rootNode: rootNodeSelector(state.magasin)
});

const mapDispatchToProps = {
  onLagreClick: update,
  loadStorageUnit: load,
  updateState,
  loadStorageObj: loadRoot
};

export default connect(mapStateToProps, mapDispatchToProps)(EditNode);
