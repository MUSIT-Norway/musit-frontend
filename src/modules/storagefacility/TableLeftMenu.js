import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';

export default class NodeLeftMenuComponent extends Component {
  static propTypes = {
    showNewNode: PropTypes.bool,
    onClickNewNode: PropTypes.func.isRequired,
    stats: PropTypes.shape({
      numNodes: PropTypes.number,
      numObjects: PropTypes.number,
      totalObjects: PropTypes.number
    }),
    onClickProperties: PropTypes.func.isRequired,
    onClickControlObservations: PropTypes.func.isRequired,
    onClickMoveNode: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    showButtons: PropTypes.bool
  };

  render() {
    const {
      showNewNode,
      onClickNewNode,
      onClickProperties,
      onClickControlObservations,
      onClickMoveNode,
      onClickDelete,
      showButtons
    } = this.props;

    const buttonLink = (type, icon, eventType, disabled, useMusitIcon) =>
      <div style={{ border: 'none', textAlign: 'center' }}>
        <Button
          bsStyle="link"
          onClick={() => eventType()}
          style={{ color: 'black' }}
          disabled={disabled}
        >
          {useMusitIcon
            ? <span className={`icon icon-${icon}`} style={{ padding: '2px' }} />
            : <FontAwesome
                name={`${icon}`}
                style={{ fontSize: '1.5em', padding: '2px' }}
              />}
          <br />
          {I18n.t(`musit.leftMenu.node.${type}`)}
        </Button>
      </div>;

    const showCount = type => {
      const count = this.props.stats && this.props.stats[type];
      return (
        <div style={{ border: 'none', textAlign: 'center' }}>
          {I18n.t(`musit.leftMenu.node.${type}`)}
          <br />
          <ControlLabel>
            {count === null ? <FontAwesome name="spinner" spin /> : count}
          </ControlLabel>
        </div>
      );
    };

    const newButton = () =>
      <div style={{ border: 'none', textAlign: 'center' }}>
        <Button onClick={() => onClickNewNode()} style={{ textAlign: 'left' }}>
          <FontAwesome name="plus-circle" style={{ padding: '2px' }} />
          {I18n.t('musit.leftMenu.node.newNode')}
        </Button>
      </div>;

    return (
      <div>
        {showNewNode && newButton()}
        {showButtons && <hr />}
        {showButtons && showCount('numNodes')}
        {showButtons && showCount('numObjects')}
        {showButtons && showCount('totalObjects')}
        {showButtons && <hr />}
        {showButtons && buttonLink('properties', 'cog', onClickProperties)}
        {showButtons &&
          buttonLink(
            'controlsobservations',
            'musitcontrolobsicon',
            onClickControlObservations,
            false,
            true
          )}
        {showButtons && buttonLink('moveNode', 'truck', onClickMoveNode)}
        {showButtons &&
          buttonLink('delete', 'trash-o', onClickDelete, this.isDeleteDisabled())}
      </div>
    );
  }

  isDeleteDisabled() {
    if (!this.props.stats) {
      return true;
    }
    const objectsOnNode = this.props.stats.numNodes;
    const underNodeCount = this.props.stats.numObjects;
    return objectsOnNode + underNodeCount > 0;
  }
}
