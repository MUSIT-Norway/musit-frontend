import 'react-select/dist/react-select.css';
import { connect } from 'react-redux';

import { clearNodes, clearObjects } from '../picklist/picklistActions';
import { NODE as PICK_NODE, OBJECT as PICK_OBJECT } from '../picklist/picklistTypes';
import { setMuseumId, setCollectionId, loadBuildinfo } from './appReducers';
import { clearSearch } from '../search/searchActions';

import App from './AppComponent';

import Notifyable from './Notifyable';

import Magasin from '../magasin/index';

const { clearRoot, loadRoot, clearStats } = Magasin.actions;
const { rootNodeSelector } = Magasin.selectors;

const mapStateToProps = (state) => ({
  user: state.app.user,
  buildinfo: state.app.buildinfo,
  rootNode: rootNodeSelector(state.magasin),
  pickListNodeCount: state.picklist[PICK_NODE] ? state.picklist[PICK_NODE].length : 0,
  pickListObjectCount: state.picklist[PICK_OBJECT] ? state.picklist[PICK_OBJECT].length : 0
});

const mapDispatchToProps = {
  setMuseumId,
  setCollectionId,
  clearRoot,
  clearStats,
  clearSearch,
  clearNodes,
  clearObjects,
  loadRoot,
  loadBuildinfo
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifyable(App));
