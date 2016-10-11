import 'react-select/dist/react-select.css'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { IndexLink, hashHistory } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, Badge } from 'react-bootstrap'
import { routerActions } from 'react-router-redux'
import { I18n } from 'react-i18nify'
import FontAwesome from 'react-fontawesome'
import { clearUser, connectUser, clearActor, loadActor } from '../../reducers/auth';
import jwtDecode from 'jwt-decode';
import { TYPES as PICK_TYPES } from '../../reducers/picklist';
import MusitUserAccount from '../../components/user-account-view'
import './index.css'

const mapStateToProps = (state) => {
  I18n.loadTranslations(state.language.data)
  I18n.setLocale('no')
  return {
    user: state.auth.user,
    pushState: routerActions.push,
    pickListNodeCount: state.picks[PICK_TYPES.NODE] ? state.picks[PICK_TYPES.NODE].length : 0,
    pickListObjectCount: state.picks[PICK_TYPES.OBJECT] ? state.picks[PICK_TYPES.OBJECT].length : 0
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearUser: () => {
      localStorage.removeItem('jwtToken')
      localStorage.removeItem('fakeToken')
      dispatch(clearUser())
      dispatch(clearActor())
    },
    loadUser: () => {
      if (localStorage.getItem('jwtToken')) {
        const user = jwtDecode(localStorage.getItem('jwtToken'))
        dispatch(connectUser(user));
        dispatch(loadActor())
        return true;
      }
      if (localStorage.getItem('fakeToken')) {
        const userId = JSON.parse(localStorage.getItem('fakeToken')).userId
        const user = require('../../../fake_security.json').users.find(u => u.userId === userId)
        dispatch(connectUser(user))
        dispatch(loadActor())
        return true;
      }
      return false;
    }
  }
}

class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    store: PropTypes.object,
    pickListNodeCount: PropTypes.number.isRequired,
    pickListObjectCount: PropTypes.number.isRequired,
    clearUser: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired
  }

  componentWillMount() {
    const loaded = this.props.loadUser()
    if (!loaded) {
      hashHistory.replace('/')
    }
  }

  handleLogout = () => {
    this.props.clearUser()
    hashHistory.replace('/')
  }

  render() {
    const { user, pickListNodeCount, pickListObjectCount } = this.props;
    const rootPath = user ? '/musit/' : '/'

    return (
      <div>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to={rootPath} activeStyle={{ color: '#33e0ff' }}>
                <div className="brand">
                  <img height="40" alt="logo" src="/assets/images/favicons/unimus_transparent100x100.png" />
                </div>
                <span>MUSIT</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav navbar>
              {user &&
                <LinkContainer to="/magasin/root">
                  <NavItem>Magasin</NavItem>
                </LinkContainer>
              }
              {user &&
                <LinkContainer to={`/picklist/${PICK_TYPES.OBJECT.toLowerCase()}`}>
                  <NavItem><Badge><FontAwesome name="rebel" />{` ${pickListObjectCount} `}</Badge></NavItem>
                </LinkContainer>
              }
              {user &&
                <LinkContainer to={`/picklist/${PICK_TYPES.NODE.toLowerCase()}`}>
                  <NavItem><Badge><FontAwesome name="folder" />{` ${pickListNodeCount} `}</Badge></NavItem>
                </LinkContainer>
              }
              {user &&
                <LinkContainer to="/reports">
                  <NavItem>Rapporter</NavItem>
                </LinkContainer>
              }
            </Nav>
            <Nav pullRight>
              {user &&
                <MusitUserAccount user={user} handleLogout={this.handleLogout} />
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="appContent">
          {this.props.children}
        </div>

        <div className="well text-center">{' '}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
