import { I18n } from 'react-i18nify';
import 'react-select/dist/react-select.css';
import React, { Component, PropTypes } from 'react';
import { IndexLink, hashHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, Button, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import MusitUserAccount from './UserAccount';
import './AppComponent.css';
import Logo from './musitLogo.png';
import LoginComponent from '../login/LoginComponent';
import {emitError} from '../../shared/errors';
import notifiable from './Notifyable';
import Loader from 'react-loader';
import { SET_COLLECTION, SET_MUSEUM } from '../../redux/sessionReducer';
import { actions } from '../app/appSession';
const { loadAppSession$, setMuseumId$, setCollectionId$ } = actions;
import { AppSession } from './appSession';
import inject from 'react-rxjs/dist/RxInject';
import scanner$, { toggleEnabled$ } from './scanner';

export class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    appSession: PropTypes.instanceOf(AppSession).isRequired,
    setMuseumId: PropTypes.func.isRequired,
    setCollectionId: PropTypes.func.isRequired,
    loadAppSession: PropTypes.func.isRequired,
    setMuseumIdInRedux: PropTypes.func.isRequired,
    setCollectionIdInRedux: PropTypes.func.isRequired,
    pickList: PropTypes.object.isRequired
  }

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

  handleCollectionId(cid) {
    this.props.setCollectionId(cid);
    this.props.setCollectionIdInRedux(cid);
    const nodeId = this.props.params.id;
    if (nodeId) {
      hashHistory.push('/magasin/' + nodeId);
    } else {
      hashHistory.push('/magasin');
    }
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


    const modalStyle = {
      position: 'fixed',
      zIndex: 1040,
      top: 0, bottom: 0, left: 0, right: 0
    };

    const backdropStyle = {
      ...modalStyle,
      zIndex: 'auto',
      backgroundColor: '#000',
      opacity: 0.5
    };


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
                <NavItem><FontAwesome name="search" style={{ fontSize: '1.3em' }} /></NavItem>
              </LinkContainer>
              <Button
                style={{ height: '50px' }}
                active={this.props.scanner.enabled}
                onClick={() => this.props.toggleEnabled()}
              >
                <img src={require('./scanIcon.png')} height={30} alt="scan" />
              </Button>
              <Button
                style={{ height: '50px' }}
                active={this.props.scanner.enabled}
                onClick={() => this.props.toggleEnabled()}
              >
                <img src={require('./scanIcon.png')} height={30} alt="scan" />
              </Button>
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
          <Modal.Dialog className="modal-container"  style={modalStyle} backdropStyle={backdropStyle}>
            <Modal.Header>
              <Modal.Title>Scan old bar code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input className="oldBarCodeInput" style={{ width: '100%'}} />
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="primary">Scan now</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>

        <footer className={this.getFooterClass()}>
          {'Build number: ' + this.props.appSession.getBuildNumber()}
        </footer>
      </div>
    );
  }
}

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  pickList$: { type: PropTypes.object.isRequired },
  scanner$
};

const commands = {
  loadAppSession$,
  setMuseumId$,
  setCollectionId$,
  toggleEnabled$
};

const mapDispatchToProps = (dispatch) => ({
  setMuseumIdInRedux: (museumId) => dispatch({ type: SET_MUSEUM, museumId }),
  setCollectionIdInRedux: (collectionId) => dispatch({ type: SET_COLLECTION, collectionId })
});

export default connect(null, mapDispatchToProps)(notifiable(inject(data, commands)(App)));
