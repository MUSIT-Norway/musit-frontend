import 'react-select/dist/react-select.css';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { setUser, loadActor } from '../../reducers/auth';
import jwtDecode from 'jwt-decode';
import { TYPES as PICK_TYPES } from '../../reducers/picklist';
import fakeUserInfo from '../../../fake_security.json';
import App from '../../components/app';
import Notifyable from './Notifyable';

const mapStateToProps = (state) => {
  return {
    user: state.auth.user.actor,
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
      window.location.replace('https://auth.dataporten.no/logout');
    },
    loadUser: () => {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        const user = jwtDecode(jwtToken);
        dispatch(setUser(user));
        dispatch(loadActor());
        return true;
      }
      const fakeToken = localStorage.getItem('fakeToken');
      if (fakeToken) {
        const userid = JSON.parse(fakeToken).userid;
        const user = fakeUserInfo.find(u => u.userid === userid);
        dispatch(setUser(user));
        dispatch(loadActor());
        return true;
      }
      return false;
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifyable(App));
