import { MenuItem, Dropdown, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';
import { I18n } from 'react-i18nify';
import MuseumId from '../../models/museumId';
import CollectionId from '../../models/collectionId';
import orderBy from 'lodash/orderBy';

export default class MusitUserAccount extends Component {
  static propTypes = {
    token: React.PropTypes.string.isRequired,
    actor: React.PropTypes.object.isRequired,
    groups: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    selectedMuseumId: React.PropTypes.instanceOf(MuseumId),
    selectedCollectionId: React.PropTypes.instanceOf(CollectionId),
    handleLogout: React.PropTypes.func.isRequired,
    handleLanguage: React.PropTypes.func.isRequired,
    handleMuseumId: React.PropTypes.func.isRequired,
    handleCollectionId: React.PropTypes.func.isRequired
  };

  getCollections(mid, groups) {
    const collections = uniqBy(
      flatten(groups.filter(g => g.museumId === mid.id).map(g => g.collections)),
      c => c.uuid
    );
    return orderBy(collections, ['name'], ['asc']);
  }

  adminLink() {
    const { token } = this.props;
    return (
      <MenuItem onSelect={() => document.getElementById('userGroupAdmin').submit()}>
        <form
          id={'userGroupAdmin'}
          method={'POST'}
          encType={'application/x-www-form-urlencoded'}
          action={'/service_auth/web'}
        >
          <input hidden="hidden" name="_at" readOnly="readOnly" value={token} />
        </form>
        <i className="fa fa-cogs" /> Admin
      </MenuItem>
    );
  }

  render() {
    const currentLanguage = localStorage.getItem('language');
    const checked = language =>
      currentLanguage === language && <FontAwesome name="check" />;
    const tooltip = (
      <Tooltip id="tooltip">
        <strong>
          {I18n.t('musit.userProfile.loggedIn', { name: this.props.actor.fn })}
        </strong>
      </Tooltip>
    );
    const menuText = (t1, t2) => (
      <Row>
        <Col md={1}>{t1}</Col>
        <Col md={1}>{t2}</Col>
      </Row>
    );
    const groups = this.props.groups;
    const museumId = this.props.selectedMuseumId;
    const collectionId = this.props.selectedCollectionId;
    const museumDropDown = groups.length > 1 && groups[0].museumName;
    const collectionDropdown = groups.length > 0 && groups[0].collections.length > 0;
    const collections = collectionDropdown && this.getCollections(museumId, groups);
    const hasAdmin = !!find(groups, g => {
      return g.permission >= 40;
    });

    return (
      <OverlayTrigger overlay={tooltip} placement="left">
        <Dropdown id="dropdown-custom-1">
          <Dropdown.Toggle
            style={{
              backgroundColor: 'transparent',
              borderColor: '#edededed',
              height: '55px'
            }}
          >
            <FontAwesome name="user" size="lg" />
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ width: 200 }}>
            <MenuItem />
            {museumDropDown &&
              <MenuItem eventKey={3} header>
                {I18n.t('musit.userProfile.museum')}
              </MenuItem>}
            {museumDropDown &&
              groups.map((cc, i) => {
                const cid = this.getCollections(new MuseumId(cc.museumId), groups)[
                  0
                ].uuid;
                return (
                  <MenuItem
                    key={i}
                    eventKey={cc.museumId}
                    onClick={() =>
                      this.props.handleMuseumId(
                        new MuseumId(cc.museumId),
                        new CollectionId(cid)
                      )}
                  >
                    {menuText(
                      museumId.id === cc.museumId ? <FontAwesome name="check" /> : '',
                      I18n.t(`musit.userProfile.museums.${cc.museumId}`)
                    )}
                  </MenuItem>
                );
              })}
            {museumDropDown && <MenuItem divider />}
            {collectionDropdown &&
              <MenuItem eventKey={3} header>
                {I18n.t('musit.userProfile.collection')}
              </MenuItem>}
            {collectionDropdown &&
              collections.map((cc, i) => (
                <MenuItem
                  key={i}
                  eventKey={cc.uuid}
                  onClick={() => this.props.handleCollectionId(new CollectionId(cc.uuid))}
                >
                  {menuText(
                    collectionId.uuid === cc.uuid ? <FontAwesome name="check" /> : '',
                    I18n.t(`musit.userProfile.collections.${cc.uuid}`)
                  )}
                </MenuItem>
              ))}
            {collectionDropdown && <MenuItem divider />}
            <MenuItem header>{I18n.t('musit.language')}</MenuItem>
            <MenuItem eventKey={5} onSelect={() => this.props.handleLanguage('no')}>
              {menuText(checked('no'), 'NO')}
            </MenuItem>
            <MenuItem eventKey={6} onSelect={() => this.props.handleLanguage('en')}>
              {menuText(checked('en'), 'EN')}
            </MenuItem>
            {hasAdmin && <MenuItem divider />}
            {hasAdmin && this.adminLink()}
            <MenuItem divider />
            <MenuItem eventKey={4} onSelect={this.props.handleLogout}>
              {I18n.t('musit.userProfile.logout')}
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </OverlayTrigger>
    );
  }
}
