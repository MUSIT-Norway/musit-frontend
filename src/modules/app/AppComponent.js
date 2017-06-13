import { I18n } from 'react-i18nify';
import 'react-select/dist/react-select.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { MenuItem, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import MusitUserAccount from './components/UserAccount';
import './AppComponent.css';
import Logo from './musitLogo.png';
import LoginComponent from '../login/LoginComponent';
import { emitError } from '../../shared/errors';
import Loader from 'react-loader';
import { loadAppSession$, setCollectionId$, setMuseumId$ } from '../../stores/appSession';
import inject from 'react-rxjs/dist/RxInject';
import {
  clearNodes$ as clearNodePicklist$,
  clearObjects$ as clearObjectPicklist$
} from '../../stores/pickList';
import Config from '../../config';
import { backendVersion, frontendVersion, VersionInfo } from '../../build';

export class AppComponent extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    appSession: PropTypes.object.isRequired,
    setMuseumId: PropTypes.func.isRequired,
    setCollectionId: PropTypes.func.isRequired,
    loadAppSession: PropTypes.func.isRequired,
    pickList: PropTypes.object.isRequired,
    goTo: PropTypes.func.isRequired,
    clearObjectPicklist: PropTypes.func.isRequired,
    clearNodePicklist: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.handleLanguage = this.handleLanguage.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleMuseumId = this.handleMuseumId.bind(this);
    this.handleCollectionId = this.handleCollectionId.bind(this);
  }

  componentWillMount() {
    this.props.loadAppSession();
  }

  handleLogout() {
    fetch('/api/auth/rest/logout', {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + this.props.appSession.accessToken
      })
    })
      .then(response => {
        if (response.ok) {
          localStorage.removeItem('accessToken');
          window.location.replace('https://auth.dataporten.no/logout');
        }
      })
      .catch(error => emitError({ type: 'network', error }));
  }

  handleLanguage(l) {
    localStorage.setItem('language', l);
    window.location.reload(true);
  }

  handleMuseumId(museumId, collectionId) {
    this.props.setMuseumId(museumId);
    this.props.setCollectionId(collectionId);
    this.props.clearObjectPicklist();
    this.props.clearNodePicklist();
    this.props.goTo(
      Config.magasin.urls.client.storagefacility.goToRoot({
        ...this.props.appSession,
        museumId,
        collectionId
      })
    );
  }

  handleCollectionId(collectionId) {
    this.props.setCollectionId(collectionId);
    this.props.clearObjectPicklist();
    const nodeId = this.props.match.params ? this.props.match.params.id : null;
    const localAppSession = { ...this.props.appSession, collectionId };
    if (nodeId) {
      this.props.goTo(
        Config.magasin.urls.client.storagefacility.goToNode(nodeId, localAppSession)
      );
    } else {
      this.props.goTo(
        Config.magasin.urls.client.storagefacility.goToRoot(localAppSession)
      );
    }
  }

  getFooterClass() {
    let returnClassName;
    if (window.location.href.toLowerCase().includes('test:')) {
      returnClassName = 'footer backgroundUTV';
    } else if (window.location.href.toLowerCase().includes('utv.uio.no')) {
      returnClassName = 'footer backgroundUTV';
    } else if (window.location.href.toLowerCase().includes('test.uio.no')) {
      returnClassName = 'footer backgroundTEST';
    } else {
      returnClassName = 'footer version well';
    }
    return returnClassName;
  }

  isSessionLoaded() {
    return !!this.props.appSession.buildInfo;
  }

  buildVersionLink(versionInfo: VersionInfo) {
    if (versionInfo.url) {
      return (
        <a target="_blank" rel="noopener noreferrer" href={versionInfo.url}>
          {versionInfo.sha}
        </a>
      );
    }
    return versionInfo.sha;
  }

  render() {
    if (!this.props.appSession.accessToken) {
      return <LoginComponent />;
    }

    if (!this.isSessionLoaded()) {
      return <Loader loaded={false} />;
    }

    return (
      <div>
        <Navbar fixedTop style={{ zIndex: 1 }}>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to={'/about'}>
                <div className="brand">
                  <img height="40" alt="logo" src={Logo} />
                </div>
                <span>MUSIT</span>
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav navbar>
              <LinkContainer
                to={Config.magasin.urls.client.magasin.goToMagasin(this.props.appSession)}
              >
                <NavItem>{I18n.t('musit.texts.magazine')}</NavItem>
              </LinkContainer>
              <LinkContainer
                to={Config.magasin.urls.client.analysis.baseUrl(this.props.appSession)}
                onClick={e => e.preventDefault()}
              >
                <NavDropdown
                  title={I18n.t('musit.analysis.analysis')}
                  id="analysis-dropdown"
                >
                  <LinkContainer
                    to={Config.magasin.urls.client.analysis.addAnalysis(
                      this.props.appSession
                    )}
                  >
                    <MenuItem>
                      {I18n.t('musit.analysis.registeringAnalysis')}
                    </MenuItem>
                  </LinkContainer>
                </NavDropdown>
              </LinkContainer>
              <LinkContainer
                to={Config.magasin.urls.client.report.goToReport(this.props.appSession)}
              >
                <NavItem>{I18n.t('musit.reports.reports')}</NavItem>
              </LinkContainer>
              <LinkContainer
                to={Config.magasin.urls.client.administration.goToAdministration(
                  this.props.appSession
                )}
              >
                <NavItem>{I18n.t('musit.administration.administration')}</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <LinkContainer
                to={Config.magasin.urls.client.picklist.goToPicklistNodes(
                  this.props.appSession
                )}
              >
                <NavItem>
                  <span className="icon icon-musitpicklistnode" />
                  {' '}
                  {this.props.pickList.nodes.length}
                </NavItem>
              </LinkContainer>
              <LinkContainer
                to={Config.magasin.urls.client.picklist.goToPicklistObjects(
                  this.props.appSession
                )}
              >
                <NavItem>
                  <span className="icon icon-musitpicklistobject" />
                  {' '}
                  {this.props.pickList.objects.length}
                </NavItem>
              </LinkContainer>
              <LinkContainer
                to={Config.magasin.urls.client.searchObjects.goToSearchObjects(
                  this.props.appSession
                )}
              >
                <NavItem>
                  <FontAwesome name="search" style={{ fontSize: '1.3em', height: 25 }} />
                </NavItem>
              </LinkContainer>
              <MusitUserAccount
                actor={this.props.appSession.actor}
                groups={this.props.appSession.groups}
                token={this.props.appSession.accessToken}
                selectedMuseumId={this.props.appSession.museumId}
                selectedCollectionId={this.props.appSession.collectionId}
                handleLogout={this.handleLogout}
                handleLanguage={this.handleLanguage}
                handleMuseumId={this.handleMuseumId}
                handleCollectionId={this.handleCollectionId}
                rootNode={this.props.rootNode}
              />
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="appContent">
          {this.props.children}
        </div>

        <footer className={this.getFooterClass()}>
          {'Backend build: '}
          {this.buildVersionLink(backendVersion(this.props.appSession.buildInfo))}
          {' - Client build: '}
          {this.buildVersionLink(frontendVersion())}
        </footer>
      </div>
    );
  }
}

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  pickList$: { type: PropTypes.object.isRequired }
};

const commands = {
  loadAppSession$,
  setMuseumId$,
  setCollectionId$,
  clearObjectPicklist$,
  clearNodePicklist$
};

export default inject(data, commands)(AppComponent);
