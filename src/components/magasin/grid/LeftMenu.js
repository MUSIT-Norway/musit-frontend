import React, { Component, PropTypes } from 'react';
import { ControlLabel, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';

export default class NodeLeftMenuComponent extends Component {
  static propTypes = {
    rootNode: PropTypes.object,
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
  }

  render() {
    const {
      rootNode,
      onClickNewNode,
      onClickProperties,
      onClickControlObservations,
      onClickMoveNode,
      onClickDelete,
      showButtons
    } = this.props;

    const buttonLink = (type, icon, eventType, disabled, useMusitIcon) => {
      let fragment = null;
      if (rootNode) {
        fragment = 
          <div style={{ border: 'none', textAlign: 'center' }}>
            <Button
              bsStyle="link"
              id={`${rootNode.id}_${type}`}
              onClick={() => eventType(rootNode.id)}
              style={{ color: 'black' }}
              disabled={disabled}
            >
              {useMusitIcon ? <span className={`icon icon-${icon}`} style={{ padding: '2px' }} /> :
                <FontAwesome name={`${icon}`} style={{ fontSize: '1.5em', padding: '2px' }} />}
              <br />
              {I18n.t(`musit.leftMenu.node.${type}`)}
            </Button>
          </div>;
        
      }
      return fragment;
    };

    const showCount = (type) => {
      let fragment = null;
      if (rootNode) {
        const count = this.props.stats[type];
        fragment = 
          <div style={{ border: 'none', textAlign: 'center' }}>
            {I18n.t(`musit.leftMenu.node.${type}`)}
            <br />
            <ControlLabel id={`${rootNode.id}_${type}`}>
              {Number.isNaN(count) ? <FontAwesome style={{ fontSize: '1.5em' }} name="spinner" /> : count}
            </ControlLabel>
          </div>;
        
      }
      return fragment;
    };

    const newButton = (identity) => {
      return (
        <div style={{ border: 'none', textAlign: 'center' }}>
          <Button
            id={`${identity}_newNode`}
            onClick={() => onClickNewNode(identity)}
            style={{ textAlign: 'left' }}
          >
            <FontAwesome name="plus-circle" style={{ padding: '2px' }} />
            {I18n.t('musit.leftMenu.node.newNode')}
          </Button>
        </div>
      );
    };
    const showStats = this.props.stats;
    return (
      <div>
        {rootNode && newButton(rootNode.id)}
        {showStats && <hr />}
        {showStats && showCount('numNodes')}
        {showStats && showCount('numObjects')}
        {showStats && showCount('totalObjects')}
        {showButtons && <hr />}
        {showButtons && buttonLink('properties', 'cog', onClickProperties)}
        {showButtons && buttonLink('controlsobservations', 'musitcontrolobsicon', onClickControlObservations, false, true)}
        {showButtons && buttonLink('moveNode', 'truck', () => onClickMoveNode(rootNode))}
        {showButtons && buttonLink('delete','trash-o', onClickDelete, this.isDeleteDisabled())}
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
