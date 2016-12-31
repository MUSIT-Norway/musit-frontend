import 'react-select/dist/react-select.css';
import { connect } from 'react-redux';

import { clearNodes, clearObjects } from '../picklist/picklistActions';
import { NODE as PICK_NODE, OBJECT as PICK_OBJECT } from '../picklist/picklistTypes';
import { setMuseumId, setCollectionId, loadBuildinfo } from './appReducers';
import { clearSearch } from '../search/searchActions';

import App from './AppComponent';

import Notifyable from './Notifyable';

import MuseumId from '../../models/museumId';

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

const mapDispatchToProps = (dispatch, store) => ({
  setMuseumId: (mid, cid) => {
    dispatch(setMuseumId(mid));
    dispatch(setCollectionId(cid));
    dispatch(clearRoot());
    dispatch(clearStats());
    dispatch(clearSearch());
    dispatch(clearNodes());
    dispatch(clearObjects());
    dispatch(loadRoot(null, new MuseumId(mid), {
      onSuccess: () => store.history.push('/magasin')
    }));
  },
  setCollectionId: (nid, cid) => {
    dispatch(setCollectionId(cid));
    if (nid) {
      store.history.push(`/magasin/${nid}`);
    } else {
      store.history.push('/magasin');
    }
  },
  loadBuildinfo: () => dispatch(loadBuildinfo())
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifyable(App));
