import 'react-select/dist/react-select.css';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { clearUser, connectUser, clearActor, loadActor } from '../../reducers/auth';
import jwtDecode from 'jwt-decode';
import { TYPES as PICK_TYPES } from '../../reducers/picklist';
import fakeUserInfo from '../../../fake_security.json';
import App from '../../components/app';

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    pushState: routerActions.push,
    pickListNodeCount: state.picks[PICK_TYPES.NODE] ? state.picks[PICK_TYPES.NODE].length : 0,
    pickListObjectCount: state.picks[PICK_TYPES.OBJECT] ? state.picks[PICK_TYPES.OBJECT].length : 0
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearUser: () => {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('fakeToken');
      dispatch(clearUser());
      dispatch(clearActor());
    },
    loadUser: () => {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        const user = jwtDecode(jwtToken);
        dispatch(connectUser(user));
        dispatch(loadActor());
        return true;
      }
      const fakeToken = localStorage.getItem('fakeToken');
      if (fakeToken) {
        const userId = JSON.parse(fakeToken).userId;
        const user = fakeUserInfo.find(u => u.userId === userId);
        dispatch(connectUser(user));
        dispatch(loadActor());
        return true;
      }
      return false;
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
