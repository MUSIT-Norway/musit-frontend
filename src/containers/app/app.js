import { I18n } from 'react-i18nify'
import 'react-select/dist/react-select.css'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { IndexLink, hashHistory } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, Badge } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { TYPES as PICK_TYPES } from '../../reducers/picklist';
import MusitUserAccount from '../../components/user-account-view'
import './index.css'
import Logo from './assets/logo.png'
import { Provider } from 'react-redux'
const $ = global.jQuery
import { emitSuccess, emitError } from '../../errors/emitter'

export default class App extends Component {
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

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static childContextTypes = {
    showModal: PropTypes.func,
    showError: PropTypes.func,
    showNotification: PropTypes.func
  }

  getChildContext() {
    return {
      showModal: this.showModal,
      showError: emitError,
      showNotification: emitSuccess
    }
  }

  showModal(title, width, componentToRender) {
    const $dialog = $('<div>').dialog({
      autoOpen: false,
      modal: true,
      title: title,
      autoResize: true,
      minHeight: "auto",
      resizable: false,
      width: width,
      close: function() {
        ReactDOM.unmountComponentAtNode(this);
        $( this ).remove();
      }
    });

    const appStore = this.context.store;

    class ClosableAndProvided extends React.Component {
      static childContextTypes = {
        closeModal: React.PropTypes.func
      }

      getChildContext() {
        return {
          closeModal: () => $dialog.dialog('close')
        }
      }

      render() {
        return (
          <Provider store={appStore}>
            {componentToRender}
          </Provider>
        )
      }
    }

    ReactDOM.render(<ClosableAndProvided />, $dialog[0])

    $dialog.dialog('open');
  }

  constructor(props, context) {
    super(props, context)
    this.showModal = this.showModal.bind(this)
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
              <LinkContainer to="/magasin/root">
                <NavItem>{ I18n.t('musit.texts.magazine') }</NavItem>
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
                <NavItem>{ I18n.t('musit.reports.reports') }</NavItem>
              </LinkContainer>
              }
            </Nav>
            <Nav pullRight>
              {user &&
              <MusitUserAccount user={this.props.user} handleLogout={this.handleLogout} />
              }
            </Nav>
            <Nav pullRight>
              {user &&
              <LinkContainer to={'/search/objects'}>
                <NavItem><FontAwesome name="search" style={{ fontSize: '1.3em' }} /></NavItem>
              </LinkContainer>
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
