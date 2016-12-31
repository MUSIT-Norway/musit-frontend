import { I18n } from 'react-i18nify';
import 'react-select/dist/react-select.css';
import React, { Component, PropTypes } from 'react';
import { IndexLink, hashHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { NODE as PICK_NODE, OBJECT as PICK_OBJECT } from '../picklist/picklistTypes';
import MusitUserAccount from './UserAccountView';
import './AppComponent.css';
import Logo from './assets/logo.png';
import MuseumId from '../../models/museumId';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    store: PropTypes.object,
    pickListNodeCount: PropTypes.number.isRequired,
    pickListObjectCount: PropTypes.number.isRequired,
    clearUser: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
    loadBuildinfo: PropTypes.func.isRequired,
    buildinfo: PropTypes.any
  }

  constructor(props, context) {
    super(props, context);
    this.handleLanguage = this.handleLanguage.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleMuseumId = this.handleMuseumId.bind(this);
    this.handleCollectionId = this.handleCollectionId.bind(this);
  }

  componentWillMount() {
    this.props.loadBuildinfo();
  }

  handleLogout() {
    this.props.clearUser();
    hashHistory.replace('/');
  }

  handleLanguage(l) {
    localStorage.setItem('language', l);
    window.location.reload(true);
  }

  handleMuseumId(mid, cid) {
    this.props.setMuseumId(mid);
    this.props.setCollectionId(cid);
    this.props.clearRoot();
    this.props.clearStats();
    this.props.clearSearch();
    this.props.clearNodes();
    this.props.clearObjects();
    this.props.loadRoot(null, new MuseumId(mid), {
      onSuccess: () => hashHistory.push('/magasin')
    });
  }

  handleCollectionId(nid, cid) {
    this.props.setCollectionId(cid);
    if (nid) {
      hashHistory.push(`/magasin/${nid}`);
    } else {
      hashHistory.push('/magasin');
    }
  }

  render() {
    const { user, pickListNodeCount, pickListObjectCount } = this.props;
    return (
      <div>
        <Navbar fixedTop style={{ zIndex:1 }}>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to={'/'} activeStyle={{ color: '#33e0ff' }}>
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
              {user &&
              <LinkContainer to="/magasin">
                <NavItem>{ I18n.t('musit.texts.magazine') }</NavItem>
              </LinkContainer>
              }
              {user &&
              <LinkContainer to="/reports">
                <NavItem>{ I18n.t('musit.reports.reports') }</NavItem>
              </LinkContainer>
              }
            </Nav>
            <Nav pullRight>
              {user &&
              <MusitUserAccount
                user={this.props.user.actor}
                groups={this.props.user.groups}
                selectedMuseumId={this.props.user.museumId.id}
                selectedCollectionId={this.props.user.collectionId.uuid}
                handleLogout={this.handleLogout}
                handleLanguage={this.handleLanguage}
                handleMuseumId={this.handleMuseumId}
                handleCollectionId={this.handleCollectionId}
                rootNode={this.props.rootNode}
              />
              }
            </Nav>
            <Nav pullRight>
              {user &&
              <LinkContainer to={'/search/objects'}>
                <NavItem><FontAwesome name="search" style={{ fontSize: '1.3em' }} /></NavItem>
              </LinkContainer>
              }
            </Nav>
            <Nav pullRight>
              {user &&
              <LinkContainer to={`/picklist/${PICK_NODE.toLowerCase()}`}>
                <NavItem><span className="icon icon-musitpicklistnode" />{` ${pickListNodeCount} `}</NavItem>
              </LinkContainer>
              }
              {user &&
              <LinkContainer to={`/picklist/${PICK_OBJECT.toLowerCase()}`}>
                <NavItem><span className="icon icon-musitpicklistobject" />{` ${pickListObjectCount} `}</NavItem>
              </LinkContainer>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="appContent">
          {this.props.children}
        </div>

        <footer className="footer well version">
          {this.props.buildinfo && ('Build number: ' + this.props.buildinfo.buildInfoBuildNumber)}
        </footer>
      </div>
    );
  }
}
