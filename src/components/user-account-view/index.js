
import { MenuItem, Dropdown, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

export default class MusitUserAccount extends Component {
  static propTypes = {
    user: React.PropTypes.object,
    selectedMuseumId: React.PropTypes.number,
    groups: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string,
      shortName: React.PropTypes.string,
      museumId: React.PropTypes.number,
      id: React.PropTypes.number
    })),
    handleLogout: React.PropTypes.func,
    handleLanguage: React.PropTypes.func,
    handleMuseumId: React.PropTypes.func
  }

  render() {
    const currentLanguage = localStorage.getItem('language');
    const checked = (language) => currentLanguage === language && <FontAwesome name="check" /> ;
    const tooltip = 
      <Tooltip id="tooltip">Logget inn som <strong>{this.props.user.fn}</strong></Tooltip>;
    const menuText = (t1, t2) => (
      <Row>
        <Col md={1}>{t1}</Col>
        <Col md={1}>{t2}</Col>
      </Row>
    );
    const groups = this.props.groups;
    const museumId = this.props.selectedMuseumId;
    const museumDropDown = groups.length > 1 && groups[0].shortName;
    return (
      <OverlayTrigger overlay={tooltip} placement="left">
        <Dropdown id="dropdown-custom-1" style={{ marginTop: 10 }} >
          <Dropdown.Toggle style={{ backgroundColor: 'transparent', borderColor: '#edededed' }}>
            <FontAwesome name="user" size="lg" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem />
            {museumDropDown &&
              <MenuItem eventKey={3} header>Samlinger</MenuItem>
            }
            {museumDropDown &&
              groups.map((cc, i) =>
                <MenuItem key={i} eventKey={cc.id} onClick={() => this.props.handleMuseumId(cc.id)}>
                  {menuText(museumId === cc.id ? <FontAwesome name="check" /> : '', cc.shortName)}
                </MenuItem>
              )
            }
            {museumDropDown &&
              <MenuItem divider/>
            }
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
