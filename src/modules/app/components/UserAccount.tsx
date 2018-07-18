import { MenuItem, Dropdown, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as React from 'react';
import { Component } from 'react';
import * as FontAwesome from 'react-fontawesome';
import { flatten, uniq, uniqBy, find, orderBy } from 'lodash';
import { I18n } from 'react-i18nify';
import { TODO, MUSTFIX } from '../../../types/common';
import { Group } from '../../../types/appSession';
import { Actor } from '../../../types/actor';

interface MusitUserAccountProps {
  token: string;
  actor: Actor;
  groups: Group[];
  selectedMuseumId: number;
  selectedCollectionId?: string;
  handleLogout: Function;
  handleLanguage: Function;
  handleMuseumId: Function;
  handleCollectionId: Function;
}

/* Old: 
  static propTypes = {
    token: PropTypes.string.isRequired,
    actor: PropTypes.object.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedMuseumId: PropTypes.number,
    selectedCollectionId: PropTypes.string,
    handleLogout: PropTypes.func.isRequired,
    handleLanguage: PropTypes.func.isRequired,
    handleMuseumId: PropTypes.func.isRequired,
    handleCollectionId: PropTypes.func.isRequired
  };

*/

export default class MusitUserAccount extends Component<MusitUserAccountProps> {
  getCollections(mid: number, groups: Group[]) {
    const collections = uniqBy(
      flatten(groups.filter(g => g.museumId === mid).map(g => g.collections)),
      c => c.uuid
    );
    return orderBy(collections, ['name'], ['asc']);
  }

  adminLink() {
    const { token } = this.props;
    return (
      <MenuItem
        onSelect={() => (document.getElementById('userGroupAdmin') as MUSTFIX).submit()}
      >
        <form
          id={'userGroupAdmin'}
          method={'POST'}
          encType={'application/x-www-form-urlencoded'}
          action={'/service_auth/web'}
          target="blank"
        >
          <input hidden={true} name="_at" readOnly={true} value={token} />
        </form>
        <i className="fa fa-cogs" /> Admin
      </MenuItem>
    );
  }

  render() {
    const currentLanguage = localStorage.getItem('language');
    const checked = (language: TODO) =>
      currentLanguage === language && <FontAwesome name="check" />;
    const tooltip = (
      <Tooltip id="tooltip">
        <strong>
          {I18n.t('musit.userProfile.loggedIn', { name: this.props.actor.fn })}
        </strong>
      </Tooltip>
    );
    const menuText = (t1: TODO, t2: TODO) => (
      <Row>
        <Col md={1} sm={1} xs={1}>
          {t1}
        </Col>
        <Col md={1} sm={1} xs={1}>
          {t2}
        </Col>
      </Row>
    );
    const groups = this.props.groups;
    const selectedMuseumId = this.props.selectedMuseumId;
    const collectionId = this.props.selectedCollectionId;
    const museumDropDown = groups.length > 1 && groups[0].museumName;
    const collectionDropdown = groups.length > 0 && groups[0].collections.length > 0;
    const collections =
      collectionDropdown && this.getCollections(selectedMuseumId, groups);
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
            {museumDropDown && (
              <MenuItem eventKey={3} header>
                {I18n.t('musit.userProfile.museum')}
              </MenuItem>
            )}
            {museumDropDown &&
              uniq(groups.map(g => g.museumId)).map((museumId, i) => {
                const defaultCollectionId = this.getCollections(museumId, groups)[0].uuid;
                return (
                  <MenuItem
                    key={'museum-' + i}
                    eventKey={museumId}
                    onClick={() =>
                      this.props.handleMuseumId(museumId, defaultCollectionId)
                    }
                  >
                    {menuText(
                      selectedMuseumId === museumId ? <FontAwesome name="check" /> : '',
                      I18n.t(`musit.userProfile.museums.${museumId}`)
                    )}
                  </MenuItem>
                );
              })}
            {museumDropDown && <MenuItem divider />}
            {collectionDropdown && (
              <MenuItem eventKey={3} header>
                {I18n.t('musit.userProfile.collection')}
              </MenuItem>
            )}
            {collectionDropdown &&
              collections &&
              collections.map((cc, i: number) => (
                <MenuItem
                  key={i}
                  eventKey={cc.uuid}
                  onClick={() => this.props.handleCollectionId(cc.uuid)}
                >
                  {menuText(
                    collectionId === cc.uuid ? <FontAwesome name="check" /> : '',
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
            <MenuItem eventKey={4} onSelect={this.props.handleLogout as TODO}>
              {I18n.t('musit.userProfile.logout')}
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </OverlayTrigger>
    );
  }
}
