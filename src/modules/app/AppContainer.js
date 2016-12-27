import 'react-select/dist/react-select.css';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';

import { clearNodes, clearObjects } from '../picklist/picklistActions';
import { NODE as PICK_NODE, OBJECT as PICK_OBJECT } from '../picklist/picklistTypes';
import { setMuseumId, setCollectionId, loadBuildinfo } from '../../reducers/auth';
import { clearSearch } from '../search/searchActions';

import App from './AppComponent';

import Notifyable from './Notifyable';

import { rootNodeSelector } from '../magasin/magasinReducers';
import { clearRoot, loadRoot, clearStats } from '../magasin/magasinActions';

import MuseumId from '../../models/museumId';

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    buildinfo: state.auth.buildinfo,
    pushState: routerActions.push,
    rootNode: rootNodeSelector(state.magasinReducers),
    pickListNodeCount: state.picks[PICK_NODE] ? state.picks[PICK_NODE].length : 0,
    pickListObjectCount: state.picks[PICK_OBJECT] ? state.picks[PICK_OBJECT].length : 0
  };
};

const mapDispatchToProps = (dispatch, store) => {
  return {
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifyable(App));
