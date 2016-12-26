import 'react-select/dist/react-select.css';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { TYPES as PICK_TYPES, clearNodes, clearObjects } from '../../reducers/picklist';
import { loadBuildinfo } from '../../reducers/auth';
import { clearSearch } from '../../reducers/objectsearch/actions';
import App from '../../components/app';
import Notifyable from './Notifyable';
import {clearStats} from '../../reducers/storageunit/stats';
import {setMuseumId, setCollectionId } from '../../reducers/auth';
import {clearRoot, loadRoot} from '../../reducers/storageunit/grid';
import MuseumId from '../../models/museumId';

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    buildinfo: state.auth.buildinfo,
    pushState: routerActions.push,
    rootNode: state.magasinReducers.storageGridUnit.root.data,
    pickListNodeCount: state.picks[PICK_TYPES.NODE] ? state.picks[PICK_TYPES.NODE].length : 0,
    pickListObjectCount: state.picks[PICK_TYPES.OBJECT] ? state.picks[PICK_TYPES.OBJECT].length : 0
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
