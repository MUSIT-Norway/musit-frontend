
import React, { Component, PropTypes } from 'react'
import { ControlLabel, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

export default class NodeLeftMenuComponent extends Component {
  static propTypes = {
    id: PropTypes.number,
    translate: PropTypes.func.isRequired,
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
      id,
      translate,
      onClickNewNode,
      objectsOnNode,
      totalObjectCount,
      underNodeCount,
      onClickProperties,
      onClickControlObservations,
      onClickMoveNode,
      onClickDelete,
      showButtons
    } = this.props

    const buttonLink = (type, icon, eventType, MusitIconType) => {
      let fragment = null
      if (Number.isInteger(id)) {
        fragment = 
          <div style={{ border: 'none', textAlign: 'center' }}>
            <Button
              bsStyle="link"
              id={`${id}_${type}`}
              onClick={() => eventType(id)}
              style={{ color: 'black' }}
            >
              {MusitIconType ? <span className={`icon icon-${icon}`} style={{ padding: '2px' }} /> :
                <FontAwesome name={`${icon}`} style={{ padding: '2px' }} />}
              <br />
              {translate(`musit.leftMenu.node.${type}`)}
            </Button>
          </div>
        
      }
      return fragment
    }

    const showCount = (type, typeText) => {
      let fragment = null
      if (Number.isInteger(id)) {
        fragment = 
          <div style={{ border: 'none', textAlign: 'center' }}>
            {translate(`musit.leftMenu.node.${typeText}`)}
            <br />
            <ControlLabel id={`${id}_${typeText}`}>
              {Number.isNaN(type) ? <FontAwesome name="spinner" /> : type}
            </ControlLabel>
          </div>
        
      }
      return fragment
    }

    const newButton = (identity) => {
      return (
        <div style={{ border: 'none', textAlign: 'center' }}>
          <Button
            id={`${identity}_newNode`}
            onClick={() => onClickNewNode(identity)}
            style={{ textAlign: 'left' }}
          >
            <FontAwesome name="plus-circle" style={{ padding: '2px' }} />
            {translate('musit.leftMenu.node.newNode')}
          </Button>
        </div>
      )
    }

    return (
      <div>
        {Number.isInteger(id) ? newButton(id) : null}
        {Number.isInteger(id) ? <hr /> : null}
        {showCount(objectsOnNode, 'objectsOnNode')}
        {showCount(totalObjectCount, 'totalObjectCount')}
        {showCount(underNodeCount, 'underNodeCount')}
        {Number.isInteger(id) ? <hr /> : null}
        {showButtons ? buttonLink('properties', 'cog', onClickProperties) : null}
        {showButtons ? buttonLink('controlsobservations', 'musitcontrolobsicon', onClickControlObservations, 1) : null}
        {showButtons ? buttonLink('moveNode', 'truck', onClickMoveNode) : null}
        {showButtons ? buttonLink('delete', 'trash-o', onClickDelete) : null}
      </div>
    )
  }
}
