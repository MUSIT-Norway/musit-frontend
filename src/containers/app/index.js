import 'react-select/dist/react-select.css';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { TYPES as PICK_TYPES } from '../../reducers/picklist';
import App from '../../components/app';
import Notifyable from './Notifyable';
import { setMuseumId } from '../../reducers/auth';

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    pushState: routerActions.push,
    pickListNodeCount: state.picks[PICK_TYPES.NODE] ? state.picks[PICK_TYPES.NODE].length : 0,
    pickListObjectCount: state.picks[PICK_TYPES.OBJECT] ? state.picks[PICK_TYPES.OBJECT].length : 0
  };
};

const mapDispatchToProps = (dispatch, store) => {
  return {
    setMuseumId: (mid) => {
      dispatch(setMuseumId(mid));
      store.history.push('/magasin');
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifyable(App));
