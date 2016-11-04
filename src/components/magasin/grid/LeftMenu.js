
import React, { Component, PropTypes } from 'react';
import { ControlLabel, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';

export default class NodeLeftMenuComponent extends Component {
  static propTypes = {
    rootNode: PropTypes.object,
    onClickNewNode: PropTypes.func.isRequired,
    objectsOnNode: PropTypes.number,
    totalObjectCount: PropTypes.number,
    underNodeCount: PropTypes.number,
    onClickProperties: PropTypes.func.isRequired,
    onClickObservations: PropTypes.func,
    onClickControlObservations: PropTypes.func.isRequired,
    onClickController: PropTypes.func,
    onClickMoveNode: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    showButtons: PropTypes.bool.isRequired
  }
  render() {
    const {
      rootNode,
      onClickNewNode,
      objectsOnNode,
      totalObjectCount,
      underNodeCount,
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

    const showCount = (type, typeText) => {
      let fragment = null;
      if (rootNode) {
        fragment = 
          <div style={{ border: 'none', textAlign: 'center' }}>
            {I18n.t(`musit.leftMenu.node.${typeText}`)}
            <br />
            <ControlLabel id={`${rootNode.id}_${typeText}`}>
              {Number.isNaN(type) ? <FontAwesome style={{ fontSize: '1.5em' }} name="spinner" /> : type}
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
    const disabled = !Number.isNaN(objectsOnNode) && !Number.isNaN(underNodeCount) && objectsOnNode + underNodeCount > 0;
    return (
      <div>
        {rootNode ? newButton(rootNode.id) : null}
        {rootNode ? <hr /> : null}
        {showCount(objectsOnNode, 'objectsOnNode')}
        {showCount(totalObjectCount, 'totalObjectCount')}
        {showCount(underNodeCount, 'underNodeCount')}
        {rootNode ? <hr /> : null}
        {showButtons ? buttonLink('properties', 'cog', onClickProperties) : null}
        {showButtons ? buttonLink('controlsobservations', 'musitcontrolobsicon', onClickControlObservations, false, true) : null}
        {showButtons ? buttonLink('moveNode', 'truck', () => onClickMoveNode(rootNode)) : null}
        {showButtons ?
          buttonLink('delete','trash-o', onClickDelete, disabled): null}
      </div>
    );
  }
}
