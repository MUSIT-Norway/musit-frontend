import { I18n } from 'react-i18nify';
import 'react-select/dist/react-select.css';
import React, { Component, PropTypes } from 'react';
import { IndexLink, hashHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import MusitUserAccount from './UserAccount';
import './AppComponent.css';
import Logo from './musitLogo.png';
import provide from '../../state/provide';
import inject from '../../state/inject';
import AppSession from './appSession';
import LoginComponent from '../login/LoginComponent';
import {emitError} from '../../shared/errors/emitter';
import notifiable from './Notifyable';

export class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    appSession: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.handleLanguage = this.handleLanguage.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleMuseumId = this.handleMuseumId.bind(this);
  }

  componentWillMount() {
    this.props.appSession.loadAppSession();
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
    if (!this.props.appSession.getBuildNumber()) {
      return null;
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
              {this.props.appSession &&
              <LinkContainer to="/magasin">
                <NavItem>{ I18n.t('musit.texts.magazine') }</NavItem>
              </LinkContainer>
              }
              {this.props.appSession &&
              <LinkContainer to="/reports">
                <NavItem>{ I18n.t('musit.reports.reports') }</NavItem>
              </LinkContainer>
              }
            </Nav>
            <Nav pullRight>
              {this.props.appSession &&
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
              }
            </Nav>
            <Nav pullRight>
              {this.props.appSession &&
              <LinkContainer to={'/search/objects'}>
                <NavItem><FontAwesome name="search" style={{ fontSize: '1.3em' }} /></NavItem>
              </LinkContainer>
              }
            </Nav>
            <Nav pullRight>
              {this.props.appSession &&
              <LinkContainer to="/picklist/nodes">
                <NavItem><span className="icon icon-musitpicklistnode" />{' '}{this.props.appSession.getPickList().nodes.length}</NavItem>
              </LinkContainer>
              }
              {this.props.appSession &&
              <LinkContainer to="/picklist/objects">
                <NavItem><span className="icon icon-musitpicklistobject" />{' '}{this.props.appSession.getPickList().objects.length}</NavItem>
              </LinkContainer>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="appContent">
          {this.props.children}
        </div>

        <footer className="footer well version">
          {'Build number: ' + this.props.appSession.getBuildNumber()}
        </footer>
      </div>
    );
  }
}

const appSession = new AppSession();
const servicesAsProps = {
  appSession: { type: React.PropTypes.object, value: () => appSession }
};
const stateAsProps = {
  provided: { appSession: { type: React.PropTypes.object.isRequired } },
  state: { appSession$state: appSession.store$ }
};
export default notifiable(provide(servicesAsProps)(inject(stateAsProps)(App)));
