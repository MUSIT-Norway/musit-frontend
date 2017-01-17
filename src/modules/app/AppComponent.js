import { I18n } from 'react-i18nify';
import 'react-select/dist/react-select.css';
import React, { Component, PropTypes } from 'react';
import { IndexLink, hashHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { TYPES as PICK_TYPES } from '../picklist/picklistReducer';
import MusitUserAccount from './UserAccount';
import './AppComponent.css';
import Logo from './musitLogo.png';
import provide from '../../state/provide';
import inject from '../../state/inject';
import appSession from './appSession';
import LoginComponent from '../login/LoginComponent';

export class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    appSession: PropTypes.object.isRequired,
    appState: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.handleLanguage = this.handleLanguage.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleMuseumId = this.handleMuseumId.bind(this);
    this.handleCollectionId = this.handleCollectionId.bind(this);
  }

  componentWillMount() {
    this.props.appSession.loadAppSession();
  }

  handleLogout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('fakeToken');
    window.location.replace('https://auth.dataporten.no/logout');
  }

  handleLanguage(l) {
    localStorage.setItem('language', l);
    window.location.reload(true);
  }

  handleMuseumId(mid, cid) {
    this.props.appSession.setMuseumId(mid);
    this.props.appSession.setCollectionId(cid);
    hashHistory.push('/magasin');
  }

  handleCollectionId(nid, cid) {
    this.props.appSession.setCollectionId(cid);
    if (nid) {
      hashHistory.push(`/magasin/${nid}`);
    } else {
      hashHistory.push('/magasin');
    }
  }

  render() {
    if (!this.props.appSession.getAccessToken()) {
      return (
        <LoginComponent
          setUser={(u) => {
            this.props.appSession.setAccessToken(u.accessToken);
            this.props.appSession.loadAppSession();
          }}
        />
      );
    }
    return (
      <div>
        <Navbar fixedTop style={{ zIndex:1 }}>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to={'/about'} activeStyle={{ color: '#33e0ff' }}>
                <div className="brand">
                  <img height="40" alt="logo" src={Logo} />
                </div>
                <span>MUSIT</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav navbar>
              {this.props.appState &&
              <LinkContainer to="/magasin">
                <NavItem>{ I18n.t('musit.texts.magazine') }</NavItem>
              </LinkContainer>
              }
              {this.props.appState &&
              <LinkContainer to="/reports">
                <NavItem>{ I18n.t('musit.reports.reports') }</NavItem>
              </LinkContainer>
              }
            </Nav>
            <Nav pullRight>
              {this.props.appState &&
              <MusitUserAccount
                user={this.props.appState}
                selectedMuseumId={this.props.appState.museumId}
                selectedCollectionId={this.props.appState.collectionId}
                handleLogout={this.handleLogout}
                handleLanguage={this.handleLanguage}
                handleMuseumId={this.handleMuseumId}
                handleCollectionId={this.handleCollectionId}
                rootNode={this.props.rootNode}
              />
              }
            </Nav>
            <Nav pullRight>
              {this.props.appState &&
              <LinkContainer to={'/search/objects'}>
                <NavItem><FontAwesome name="search" style={{ fontSize: '1.3em' }} /></NavItem>
              </LinkContainer>
              }
            </Nav>
            <Nav pullRight>
              {this.props.appState &&
              <LinkContainer to={`/picklist/${PICK_TYPES.NODE.toLowerCase()}`}>
                <NavItem><span className="icon icon-musitpicklistnode" />0</NavItem>
              </LinkContainer>
              }
              {this.props.appState &&
              <LinkContainer to={`/picklist/${PICK_TYPES.OBJECT.toLowerCase()}`}>
                <NavItem><span className="icon icon-musitpicklistobject" />0</NavItem>
              </LinkContainer>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="appContent">
          {this.props.children}
        </div>

        <footer className="footer well version">
          {'Build number: ' + this.props.appState.buildInfo.buildInfoBuildNumber}
        </footer>
      </div>
    );
  }
}

const services = {
  appSession: { type: PropTypes.object, value: () => appSession }
};
const state = {
  provided: { appSession: { type: React.PropTypes.object.isRequired } },
  state: { appState$: appSession.store$ }
};
export default provide(services)(inject(state)(App));