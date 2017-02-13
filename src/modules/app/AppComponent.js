import { I18n } from 'react-i18nify';
import 'react-select/dist/react-select.css';
import React, { Component, PropTypes } from 'react';
import { IndexLink, hashHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, Modal, Button, Form, FormGroup } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import MusitUserAccount from './UserAccount';
import './AppComponent.css';
import Logo from './musitLogo.png';
import LoginComponent from '../login/LoginComponent';
import {emitError} from '../../shared/errors';
import notifiable from './Notifyable';
import Loader from 'react-loader';
import { loadAppSession$, setMuseumId$, setCollectionId$ } from '../app/appSession';
import { AppSession } from './appSession';
import inject from 'react-rxjs/dist/RxInject';
import scanner$, { toggleEnabled$, scanForOldBarCode$, prepareSearch$ } from './scanner';

export class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    appSession: PropTypes.instanceOf(AppSession).isRequired,
    scanner: PropTypes.object.isRequired,
    prepareSearch: PropTypes.func.isRequired,
    setMuseumId: PropTypes.func.isRequired,
    setCollectionId: PropTypes.func.isRequired,
    loadAppSession: PropTypes.func.isRequired,
    pickList: PropTypes.object.isRequired,
    scanForOldBarCode: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.handleLanguage = this.handleLanguage.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleMuseumId = this.handleMuseumId.bind(this);
    this.handleCollectionId = this.handleCollectionId.bind(this);
    this.searchForBarCode = this.searchForBarCode.bind(this);
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
    this.props.setCollectionId(cid);
    hashHistory.push('/magasin');
  }

  handleCollectionId(cid) {
    this.props.setCollectionId(cid);
    const nodeId = this.props.params.id;
    if (nodeId) {
      hashHistory.push('/magasin/' + nodeId);
    } else {
      hashHistory.push('/magasin');
    }
  }

  searchForBarCode() {
    this.props.prepareSearch();
    this.props.scanForOldBarCode({
      barcode: this.props.scanner.code,
      token: this.props.appSession.getAccessToken(),
      museumId: this.props.appSession.getMuseumId(),
      collectionId: this.props.appSession.getCollectionId()
    });
  }

  getFooterClass(){
    let returnClassName;
    if (window.location.href.toLowerCase().includes('test:')) {
      returnClassName = 'footer backgroundUTV';
    } else if (window.location.href.toLowerCase().includes('utv.uio.no')) {
      returnClassName = 'footer backgroundUTV';
    } else if (window.location.href.toLowerCase().includes('test.uio.no')){
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
              <LinkContainer to="/picklist/nodes">
                <NavItem><span className="icon icon-musitpicklistnode" />{' '}{this.props.pickList.nodes.length}</NavItem>
              </LinkContainer>
              <LinkContainer to="/picklist/objects">
                <NavItem><span className="icon icon-musitpicklistobject" />{' '}{this.props.pickList.objects.length}</NavItem>
              </LinkContainer>
              <LinkContainer to={'/search/objects'}>
                <NavItem><FontAwesome name="search" style={{ fontSize: '1.3em', height: 25 }} /></NavItem>
              </LinkContainer>
              <LinkContainer to={'/scan'} active={this.props.scanner.enabled} onClick={(e) => {
                e.preventDefault();
                this.props.toggleEnabled();
              }}>
                <NavItem>
                  <img src={require('./scanIcon.png')} height={25} alt="scan" />
                </NavItem>
              </LinkContainer>
              <MusitUserAccount
                actor={this.props.appSession.getActor()}
                groups={this.props.appSession.getGroups()}
                token={this.props.appSession.getAccessToken()}
                selectedMuseumId={this.props.appSession.getMuseumId()}
                selectedCollectionId={this.props.appSession.getCollectionId()}
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
          {'Build number: ' + this.props.appSession.getBuildNumber()}
        </footer>

        <Modal show={this.props.scanner.enabled && !!this.props.scanner.code} bsSize="small">
          <Modal.Body>
            <Form inline>
              <FormGroup controlId="barCode">
                <input type="text" className="form-control" readOnly value={this.props.scanner.code || ''}/>
              </FormGroup>
              <Button bsStyle="success" onClick={this.searchForBarCode}>Search</Button>
            </Form>
            <Loader loaded={!this.props.scanner.searchPending} />
            {this.props.scanner.searchComplete && (!this.props.scanner.matches || this.props.scanner.matches.length === 0) &&
              <center>No matching node or object</center>
            }
            {this.props.scanner.matches && Array.isArray(this.props.scanner.matches) && this.props.scanner.matches.length > 0 &&
              <ul>
              {this.props.scanner.matches.map(match => {
                return (
                  <li>
                    {this.props.params.id ? <a onClick={e => {
                      e.preventDefault();
                      hashHistory.push('/magasin/' + this.props.params.id + '/objects');
                    }}>{match.getObjectDescription()}</a> : match.getObjectDescription()}
                  </li>
                );
              })}
              </ul>
            }
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const data = {
  appSession$: {
    type: PropTypes.object.isRequired,
    mapToProps: (appSession$) => ({
      scanner$: scanner$(appSession$)
    })
  },
  pickList$: { type: PropTypes.object.isRequired }
};

const commands = {
  loadAppSession$,
  setMuseumId$,
  setCollectionId$,
  toggleEnabled$,
  scanForOldBarCode$,
  prepareSearch$
};

export default notifiable(inject(data, commands)(App));
