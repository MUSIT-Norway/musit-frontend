
import { MenuItem, Dropdown, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

export default class MusitUserAccount extends Component {
  static propTypes = {
    user: React.PropTypes.object,
    collections: React.PropTypes.array,
    selectedCollection: React.PropTypes.number,
    handleLogout: React.PropTypes.func,
    handleLanguage: React.PropTypes.func
  }
  static defaultProps = {
    collections: [
      {
        id: 1,
        collection: 'Lav',
        museum: 'O'
      },
      {
        id: 3,
        collection: 'Sopp',
        museum: 'NHM'
      }
    ],
    selectedCollection: 1
  }


  render() {
    const currentLanguage = localStorage.getItem('language');
    const checked = (language) => currentLanguage === language && <FontAwesome name="check" /> ;
    const tooltip = 
      <Tooltip id="tooltip">Logget inn som <strong>{this.props.user.userId}</strong></Tooltip>;
    const menuText = (t1, t2) =>
      <Row>
        <Col md={1}>{t1}</Col>
        <Col md={1}>{t2}</Col>
      </Row>
    ;
    return (
      <OverlayTrigger overlay={tooltip}>
        <Dropdown id="dropdown-custom-1" style={{ marginTop: 10 }} >
          <Dropdown.Toggle style={{ backgroundColor: 'transparent', borderColor: '#edededed' }}>
            <FontAwesome name="user" size="lg" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem />
            <MenuItem eventKey={1}>Min konto</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3} header>Samlinger</MenuItem>
            {this.props.collections.map(
              (cc, i) =>
                this.props.selectedCollection === cc.id ?
                  <MenuItem key={i} eventKey={`coll_${cc.id}`}>
                    {menuText(<FontAwesome name="check" />, cc.collection)}
                  </MenuItem> :
                  <MenuItem key={i}>
                    {menuText('', cc.collection)}
                  </MenuItem>)
            }
            <MenuItem divider />
            <MenuItem header>Language</MenuItem>
            <MenuItem eventKey={5} onSelect={() => this.props.handleLanguage('no')}>
              {menuText(checked('no'),'NO')}
            </MenuItem>
            <MenuItem eventKey={6} onSelect={() => this.props.handleLanguage('en')}>
              {menuText(checked('en'),'EN')}
            </MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={4} onSelect={this.props.handleLogout}>Logg ut</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </OverlayTrigger>);
  }
}
