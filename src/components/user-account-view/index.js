/* @flow */
import { MenuItem, Dropdown, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'

export default class MusitUserAccount extends Component {
  static propTypes = {
    user: React.PropTypes.object,
    collections: React.PropTypes.array,
    selectedCollection: React.PropTypes.number,
    handleLogout: React.PropTypes.func
  }
  static defaultProps = {
    collections: [
      {
        id: 1,
        collection: 'Lav',
        museum: 'O',
      },
      {
        id: 3,
        collection: 'Sopp',
        museum: 'NHM',
      }
    ],
    selectedCollection: 1
  }

  render() {
    const tooltip = (
      <Tooltip id="tooltip">Logget inn som <strong>{this.props.user.userId}</strong></Tooltip>
    );
    const menuText = (t1, t2) =>
    (<Row>
      <Col md={1}>{t1}</Col>
      <Col md={1}>{t2}</Col>
    </Row>)
    return (
      <OverlayTrigger overlay={tooltip}>
        <Dropdown id="dropdown-custom-1" style={{ marginTop: 10 }} >
          <Dropdown.Toggle style={{ backgroundColor: 'transparent', borderColor: '#edededed' }}>
            <FontAwesome name="user" size="1x" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem eventKey={1}>Min konto</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={2}>Samlinger</MenuItem>
            {this.props.collections.map(
              (cc) =>
              ((this.props.selectedCollection === cc.id) ?
                <MenuItem eventKey={`coll_${cc.id}`}>
                  {menuText(<FontAwesome name="check" />, cc.collection)}
                </MenuItem> :
                <MenuItem>
                  {menuText('', cc.collection)}
                </MenuItem>))
              }
            <MenuItem divider />
            <MenuItem eventKey={4} onSelect={this.props.handleLogout}>Logg ut</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </OverlayTrigger>)
  }
}
