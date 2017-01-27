import { I18n } from 'react-i18nify';
import 'react-select/dist/react-select.css';
import React, { Component, PropTypes } from 'react';
import { IndexLink, hashHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import MusitUserAccount from './UserAccount';
import './AppComponent.css';
import Logo from './musitLogo.png';
import inject from '../../rxjs/inject';
import LoginComponent from '../login/LoginComponent';
import {emitError} from '../../shared/errors';
import notifiable from './Notifyable';
import Loader from 'react-loader';
import { SET_COLLECTION, SET_MUSEUM } from '../../redux/sessionReducer';
import { actions } from '../app/appSession';
const { loadAppSession$, setMuseumId$, setCollectionId$ } = actions;
import { AppSession } from './appSession';

export class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    appSession: PropTypes.instanceOf(AppSession).isRequired,
    setMuseumId: PropTypes.func.isRequired,
    setCollectionId: PropTypes.func.isRequired,
    loadAppSession: PropTypes.func.isRequired,
    setMuseumIdInRedux: PropTypes.func.isRequired,
    setCollectionIdInRedux: PropTypes.func.isRequired,
    picks: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.handleLanguage = this.handleLanguage.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleMuseumId = this.handleMuseumId.bind(this);
  }

  componentWillMount() {
    this.props.loadAppSession();
  }

  handleLogout() {
    fetch('/api/auth/rest/logout', {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + this.props.appSession.getAccessToken()
      })
    }).then(response => {
      if (response.ok) {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('accessToken');
        window.location.replace('https://auth.dataporten.no/logout');
      }
    }).catch(error => emitError({ type: 'network', error}));
  }

  handleLanguage(l) {
    localStorage.setItem('language', l);
    window.location.reload(true);
  }

  handleMuseumId(mid, cid) {
    this.props.setMuseumId(mid);
    this.props.setMuseumIdInRedux(mid);
    this.props.setCollectionId(cid);
    this.props.setCollectionIdInRedux(cid);
    hashHistory.push('/magasin');
  }

  handleCollectionId(nid, cid) {
    this.props.setCollectionId(cid);
    this.props.setCollectionIdInRedux(cid);
    if (nid) {
      hashHistory.push(`/magasin/${nid}`);
    } else {
      hashHistory.push('/magasin');
    }
  }
  getFooterClass(){
    let returnClassName;
    if (window.location.href.toLowerCase().includes('test:')) {
      returnClassName = 'footer backgroundUTV';
    } else if (window.location.href.toLowerCase().includes('utv.uio.no:')) {
      returnClassName = 'footer backgroundUTV';
    } else if (window.location.href.toLowerCase().includes('test.uio.no:')){
      returnClassName = 'footer backgroundTEST';
    } else {
      returnClassName = 'footer version well';
    }
    return returnClassName;
  }
  render() {
    if (!this.props.appSession.getAccessToken()) {
      return (
        <LoginComponent />
      );
    }
    if (!this.props.appSession.getBuildNumber()) {
      return <Loader loaded={false} />;
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
              <LinkContainer to="/magasin">
                <NavItem>{ I18n.t('musit.texts.magazine') }</NavItem>
              </LinkContainer>
              <LinkContainer to="/reports">
                <NavItem>{ I18n.t('musit.reports.reports') }</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <MusitUserAccount
                actor={this.props.appSession.getActor()}
                groups={this.props.appSession.getGroups()}
                token={this.props.appSession.getAccessToken()}
                selectedMuseumId={this.props.appSession.getMuseumId()}
                selectedCollectionId={this.props.appSession.getCollectionId()}
                handleLogout={this.handleLogout}
                handleLanguage={this.handleLanguage}
                handleMuseumId={this.handleMuseumId}
                handleCollectionId={(uuid) => this.handleCollectionId(this.props.rootNode && this.props.rootNode.id, uuid)}
                rootNode={this.props.rootNode}
              />
            </Nav>
            <Nav pullRight>
              <LinkContainer to={'/search/objects'}>
                <NavItem><FontAwesome name="search" style={{ fontSize: '1.3em' }} /></NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <LinkContainer to="/picklist/node">
                <NavItem><span className="icon icon-musitpicklistnode" />{' '}{this.props.picks.NODE.length}</NavItem>
              </LinkContainer>
              <LinkContainer to="/picklist/object">
                <NavItem><span className="icon icon-musitpicklistobject" />{' '}{this.props.picks.OBJECT.length}</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="appContent">
          {this.props.children}
        </div>

        <footer className={this.getFooterClass()}>
          {'Build number: ' + this.props.appSession.getBuildNumber()}
        </footer>
      </div>
    );
  }
}

const data = {
  appSession$: { type: PropTypes.object.isRequired }
};

const commands = {
  loadAppSession$,
  setMuseumId$,
  setCollectionId$
};

const mapStateToProps = (state) => ({
  picks: state.picks
});

const mapDispatchToProps = (dispatch) => ({
  setMuseumIdInRedux: (museumId) => dispatch({ type: SET_MUSEUM, museumId }),
  setCollectionIdInRedux: (collectionId) => dispatch({ type: SET_COLLECTION, collectionId })
});

export default connect(mapStateToProps, mapDispatchToProps)(notifiable(inject(data, commands)(App)));
