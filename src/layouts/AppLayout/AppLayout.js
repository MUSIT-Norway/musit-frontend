import 'react-select/dist/react-select.css'
import React, { Component, PropTypes } from 'react'
import { IndexLink, hashHistory } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, Badge } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { TYPES as PICK_TYPES } from '../../reducer/picklist'
import './index.scss'
import logo from './assets/unimus_transparent100x100.png'
import './variables.scss'
import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss'
import './bootstrap.overrides.scss'
import 'font-awesome/scss/font-awesome.scss'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    store: PropTypes.object,
    pickListNodeCount: PropTypes.number.isRequired,
    pickListObjectCount: PropTypes.number.isRequired,
    clearUser: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired
  }

  componentWillMount () {
    const loaded = this.props.loadUser()
    if (!loaded) {
      hashHistory.replace('/')
    }
  }

  handleLogout = (event) => {
    event.preventDefault()
    this.props.clearUser()
    hashHistory.replace('/')
  }

  render () {
    const { user, pickListNodeCount, pickListObjectCount } = this.props
    const rootPath = user ? '/musit/' : '/'
    return (
      <div className='app'>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to={rootPath} activeStyle={{ color: '#33e0ff' }}>
                <div className='brand'>
                  <img height='40' alt='logo' src={logo} />
                </div>
                <span>MUSIT</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav navbar>
              {user &&
                <LinkContainer to='/magasin/root'>
                  <NavItem>Magasin</NavItem>
                </LinkContainer>
              }
              {user &&
                <LinkContainer to={`/picklist/${PICK_TYPES.OBJECT.toLowerCase()}`}>
                  <NavItem><Badge><FontAwesome name='rebel' />{` ${pickListObjectCount} `}</Badge></NavItem>
                </LinkContainer>
              }
              {user &&
                <LinkContainer to={`/picklist/${PICK_TYPES.NODE.toLowerCase()}`}>
                  <NavItem><Badge><FontAwesome name='folder' />{` ${pickListNodeCount} `}</Badge></NavItem>
                </LinkContainer>
              }
              {user &&
                <LinkContainer to='/musit/logout'>
                  <NavItem className='logout-link' onClick={this.handleLogout}>Logout</NavItem>
                </LinkContainer>
              }
            </Nav>
            {user &&
              <p className='loggedInMessage navbar-text'>Logged in as <strong>{user.name}</strong>.</p>}
          </Navbar.Collapse>
        </Navbar>

        <div className='appContent'>
          {this.props.children}
        </div>

        <div className='well text-center'>{' '}</div>
      </div>
    )
  }
}
