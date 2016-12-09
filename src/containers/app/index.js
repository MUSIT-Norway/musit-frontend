import 'react-select/dist/react-select.css';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { TYPES as PICK_TYPES } from '../../reducers/picklist';
import App from '../../components/app';
import Notifyable from './Notifyable';
import { setMuseumId, setCollectionId } from '../../reducers/auth';
import {loadRoot as loadRootNodes, clearRoot} from '../../reducers/storageunit/grid';
import {clearStats} from '../../reducers/storageunit/stats';
import MuseumId from '../../models/museumId';

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    pushState: routerActions.push,
    rootNode: state.storageGridUnit.root.data,
    pickListNodeCount: state.picks[PICK_TYPES.NODE] ? state.picks[PICK_TYPES.NODE].length : 0,
    pickListObjectCount: state.picks[PICK_TYPES.OBJECT] ? state.picks[PICK_TYPES.OBJECT].length : 0
  };
};

const mapDispatchToProps = (dispatch, store) => {
  return {
    setMuseumId: (nid, mid) => {
      dispatch(setMuseumId(mid));
      store.history.push('/magasin');
      dispatch(clearRoot());
      dispatch(clearStats());
      dispatch(loadRootNodes(null, new MuseumId(mid)));
    },
    setCollectionId: (nid, cid) => {
      dispatch(setCollectionId(cid));
      if (nid) {
        store.history.push(`/magasin/${nid}`);
      } else {
        store.history.push('/magasin');
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifyable(App));
