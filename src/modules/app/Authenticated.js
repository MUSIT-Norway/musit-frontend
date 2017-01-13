import React from 'react';
import Loader from 'react-loader';
import App from './AppContainer';
import Login from '../login/LoginContainer';
import {connect} from 'react-redux';
import { setUser, loadActor } from './appReducer';
import fakeUserInfo from '../../../fake_security.json';
import jwtDecode from 'jwt-decode';
import { emitError } from '../../shared/errors/emitter';

class Authenticated extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  isLoaded() {
    const user = this.props.user;
    return user && user.museumId;
  }

  componentWillMount() {
    this.props.loadUser({
      onFailure: (e) => {
        if (e) {
          emitError(e);
        }
        this.setState({ needToLogin: true });
      }
    });
  }

  render() {
    const loaded = !!this.isLoaded();
    if (!loaded && this.state.needToLogin) {
      return <Login />;
    }
    return (
      <Loader loaded={loaded}>
        <App {...this.props}>
          {this.props.children}
        </App>
      </Loader>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearUser: () => {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('fakeToken');
      window.location.replace('https://auth.dataporten.no/logout');
    },
    loadUser: (callback) => {
      let user;
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        user = jwtDecode(jwtToken);
      }
      const fakeToken = localStorage.getItem('fakeToken');
      if (fakeToken) {
        const userid = JSON.parse(fakeToken).userid;
        user = fakeUserInfo.find(u => u.userid === userid);
      }
      if (user) {
        dispatch(setUser(user));
        dispatch(loadActor(callback));
      } else {
        callback.onFailure();
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticated);